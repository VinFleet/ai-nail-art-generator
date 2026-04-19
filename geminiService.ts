import { NailDesignState } from "./types";

export const generateNailArt = async (
  _originalImageBase64: string,
  design: NailDesignState
): Promise<string> => {
  let apiKey = import.meta.env.VITE_MINIMAX_API_KEY || import.meta.env.VITE_API_KEY;
  if (!apiKey && window.nailArtSettings?.apiKey) {
    apiKey = window.nailArtSettings.apiKey;
  }

  if (!apiKey) {
    throw new Error("API Key is missing. Please set VITE_MINIMAX_API_KEY in your .env file.");
  }

  const color = design.useCustomColor ? design.customColor : getColorForFamily(design.baseColorFamily);

  let prompt = `You are a professional nail artist. Generate a stunning, photorealistic close-up image of beautiful nail art.

Design specifications:
- Number of nails: ${design.nailCount}
- Base color: ${design.useCustomColor ? design.customColor : design.baseColorFamily}
- Nail shape: ${design.shape}
- Nail length: ${design.length}
- Finish / texture: ${design.finish}
- Art style: ${design.artStyle}`;

  if (design.patternPrompt) {
    prompt += `\n- Custom pattern: ${design.patternPrompt}`;
  }

  prompt += `\n\nIMPORTANT COMPOSITION:
- Show a clear, FULL-FRAME close-up of all ${design.nailCount} nails arranged in a horizontal row
- All nails must be IN FOCUS and fully visible — no cropped, blurred, or cut-off nails
- The image should be ZOOMED IN to show ONLY the nails, filling the entire frame
- No hand, wrist, or background visible — ONLY the nails themselves
- Even spacing between all nails, all the same size and shape
- Clean, neutral, solid background (light gray or soft white)
- Professional nail salon photography style — crisp, sharp, high resolution
- Realistic lighting with natural shine/reflections matching the finish type`;

  const body = {
    model: "image-01",
    prompt: prompt,
    aspect_ratio: "1:1",
    response_format: "base64",
  };

  let lastError = "";

  for (let attempt = 1; attempt <= 3; attempt++) {
    let data: any;
    try {
      const response = await fetch("https://api.minimax.io/v1/image_generation", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      data = await response.json();
    } catch (err: any) {
      lastError = err?.message || "Network error";
      continue;
    }

    const baseResp = data?.base_resp;
    const statusCode = baseResp?.status_code;

    if (statusCode === 0) {
      const images = data?.data?.image_base64;
      if (images && images.length > 0 && images[0].length > 1000) {
        return `data:image/png;base64,${images[0]}`;
      }
      lastError = "No image returned from MiniMax API. Please try again.";
      continue;
    }

    if ([1033, 1004, 1005, 1006].includes(statusCode)) {
      lastError = baseResp?.status_msg || "MiniMax is busy. Retrying...";
      if (attempt < 3) {
        await new Promise((r) => setTimeout(r, attempt * 2000));
        continue;
      }
    } else {
      lastError = baseResp?.status_msg || `MiniMax error (${statusCode})`;
      break;
    }
  }

  throw new Error(lastError || "Failed to generate nail art. Please try again.");
};

function getColorForFamily(family: string): string {
  const map: Record<string, string> = {
    [BaseColorFamily.Nude]: "#e8c4a0",
    [BaseColorFamily.Pink]: "#ffb7b2",
    [BaseColorFamily.Red]: "#d50000",
    [BaseColorFamily.Purple]: "#9c27b0",
    [BaseColorFamily.Blue]: "#1565c0",
    [BaseColorFamily.Green]: "#2e7d32",
    [BaseColorFamily.Yellow]: "#f9a825",
    [BaseColorFamily.Orange]: "#ff7043",
    [BaseColorFamily.Brown]: "#795548",
    [BaseColorFamily.Black]: "#1a1a1a",
    [BaseColorFamily.White]: "#fafafa",
    [BaseColorFamily.Rainbow]: "rainbow multicolor",
  };
  return map[family] || "#ffb7b2";
}

export enum BaseColorFamily {
  Nude = 'Nude / Natural',
  Pink = 'Pink / Rose',
  Red = 'Red / Crimson',
  Purple = 'Purple / Lavender',
  Blue = 'Blue / Navy',
  Green = 'Green / Mint',
  Yellow = 'Yellow / Gold',
  Orange = 'Orange / Peach',
  Brown = 'Brown / Chocolate',
  Black = 'Black / Dark',
  White = 'White / Cream',
  Rainbow = 'Rainbow / Multicolor',
}
