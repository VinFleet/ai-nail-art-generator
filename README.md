# Nail Art Generator

An AI-powered nail art generator powered by **MiniMax M2.7**. Design beautiful, photorealistic nail art from text prompts — no uploads needed, just configure your design and generate.

---

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **AI**: MiniMax M2.7 API (`image-01` model)
- **Styling**: Tailwind CSS (via CDN)
- **Icons**: Lucide React

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Your MiniMax API Key

Create a `.env` file in the root:

```
VITE_MINIMAX_API_KEY=your_minimax_api_key_here
```

Get your API key from [platform.minimax.io](https://platform.minimax.io) — you need a plan that includes **Image Generation**.

### 3. Run

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 4. Build for Production

```bash
npm run build
```

Output goes to `dist/`.

---

## Design Options

The app generates nail art from these parameters:

| Option | Values | Description |
|---|---|---|
| **Color Family** | 12 families (Nude, Pink, Red, Purple, etc.) | Base color category |
| **Custom Color** | Hex color picker | Override color family |
| **Shape** | Almond, Coffin, Square, Stiletto, Oval, Ballerina, Round, Edge | Nail shape |
| **Length** | Bare, Short, Medium, Long, XL | Nail length |
| **Finish** | Glossy, Matte, Chrome, Glitter, Holographic, Velvet, Cracked, Marble | Surface texture |
| **Art Style** | Solid Color, French Tip, Ombre, Marble, Glitter Accent, Floral, Geometric, Leopard, Abstract, Galaxy, Seasonal, Minimalist | Design style |
| **Pattern** | Free text | Custom nail art description |
| **Nail Count** | 5, 10, 15, 20 | Number of nails per image |

---

## API Reference

### Generate Nail Art

**Endpoint:** `POST https://api.minimax.io/v1/image_generation`

**Auth:** `Authorization: Bearer {VITE_MINIMAX_API_KEY}`

**Request Body:**

```json
{
  "model": "image-01",
  "prompt": "You are a professional nail artist. Generate a stunning, photorealistic close-up image of beautiful nail art.\n\nDesign specifications:\n- Number of nails: 5\n- Base color: Pink / Rose\n- Nail shape: Almond\n- Nail length: Medium\n- Finish / texture: Glossy\n- Art style: Solid Color\n\nIMPORTANT COMPOSITION:\n- Show a clear, FULL-FRAME close-up of all 5 nails arranged in a horizontal row\n- All nails must be IN FOCUS and fully visible — no cropped, blurred, or cut-off nails\n- The image should be ZOOMED IN to show ONLY the nails, filling the entire frame\n- No hand, wrist, or background visible — ONLY the nails themselves\n- Even spacing between all nails, all the same size and shape\n- Clean, neutral, solid background (light gray or soft white)\n- Professional nail salon photography style — crisp, sharp, high resolution\n- Realistic lighting with natural shine/reflections matching the finish type",
  "aspect_ratio": "1:1",
  "response_format": "base64"
}
```

**Success Response (`status_code: 0`):**

```json
{
  "id": "0634xxxxxxxxxxxx",
  "data": {
    "image_base64": ["base64_encoded_jpeg_image_data..."]
  },
  "metadata": { ... },
  "base_resp": {
    "status_code": 0,
    "status_msg": "success"
  }
}
```

**Error Codes:**

| Code | Message | Fix |
|---|---|---|
| 1033 | System error | Retry — MiniMax is temporarily busy |
| 2061 | Token plan not support model | Upgrade to a plan that includes `image-01` |
| 1004/1005/1006 | Rate limit | Wait and retry |

### Error Handling

The service retries up to 3 times on transient errors (system error, rate limit). If all attempts fail, it throws an error with the MiniMax status message.

### Retry Logic

```typescript
for (let attempt = 1; attempt <= 3; attempt++) {
  // Call API
  if (statusCode === 0 && images.length > 0) return images[0];
  if ([1033, 1004, 1005, 1006].includes(statusCode)) {
    await new Promise(r => setTimeout(r, attempt * 2000)); // Backoff
    continue;
  }
  throw new Error(status_msg);
}
```

---

## File Structure

```
ai-nail-art-generator/
├── App.tsx              # Main app component
├── ControlPanel.tsx     # Design controls (toggles, dropdowns, color picker)
├── geminiService.ts     # MiniMax API integration + retry logic
├── types.ts            # NailDesignState, enums (Shape, Length, Finish, etc.)
├── index.html          # HTML with Tailwind CDN + Google Fonts
├── index.css          # Base styles
├── index.tsx          # React entry point
├── vite.config.ts     # Vite config (loads .env)
├── tsconfig.json
└── package.json
```

---

## Deployment

### Vercel

1. Connect your GitHub repo to Vercel
2. Add environment variable: `VITE_MINIMAX_API_KEY`
3. Deploy

```bash
npm run build  # builds to dist/
```

Vercel build command: `npm run build`
Output directory: `dist`

### WordPress (iframe embed)

```html
<iframe
  src="https://your-deployed-url.vercel.app"
  width="100%"
  height="900px"
  style="border: none; border-radius: 12px;"
  loading="lazy">
</iframe>
```

---

## Troubleshooting

**"Token plan not support model"**
→ Your MiniMax plan doesn't include image generation. Upgrade at platform.minimax.io.

**"System error" on every attempt**
→ MiniMax is temporarily overloaded. Wait 30 seconds and try again. The app retries automatically.

**Blurry / half-hand images**
→ The prompt enforces full-frame nail close-ups. If the model ignores it, try simplifying the design (e.g., change art style or length).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_MINIMAX_API_KEY` | Yes | Your MiniMax API key |

---

Built with ❤️
