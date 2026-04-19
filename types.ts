export enum NailShape {
  Almond = 'Almond',
  Coffin = 'Coffin',
  Square = 'Square',
  Stiletto = 'Stiletto',
  Oval = 'Oval',
  Ballerina = 'Ballerina',
  Round = 'Round',
  Edge = 'Edge (negative space)',
}

export enum NailLength {
  Bare = 'Bare',
  Short = 'Short',
  Medium = 'Medium',
  Long = 'Long',
  XL = 'Extra Long',
}

export enum NailFinish {
  Glossy = 'Glossy',
  Matte = 'Matte',
  Chrome = 'Chrome / Metallic',
  Glitter = 'Glitter / Sparkle',
  Holographic = 'Holographic / Iridescent',
  Velvet = 'Velvet / Soft Matte',
  Cracked = 'Cracked / Textured',
  Marble = 'Marble / Swirl',
}

export enum NailArtStyle {
  SolidColor = 'Solid Color',
  FrenchTip = 'French Tip',
  OmbreGradient = 'Ombre / Gradient',
  Marble = 'Marble',
  GlitterAccent = 'Glitter Accent',
  FloralPattern = 'Floral / Botanical',
  GeometricPattern = 'Geometric / Abstract',
  LeopardPrint = 'Leopard / Animal Print',
  AbstractArt = 'Abstract Art',
  GalaxySpace = 'Galaxy / Space',
  SeasonalHoliday = 'Seasonal / Holiday',
  MinimalistLine = 'Minimalist / Line Art',
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

export interface NailDesignState {
  nailCount: number;
  showCuticles: boolean;
  baseColorFamily: BaseColorFamily;
  customColor: string;
  useCustomColor: boolean;
  shape: NailShape;
  length: NailLength;
  finish: NailFinish;
  artStyle: NailArtStyle;
  patternPrompt: string;
}

export const DEFAULT_DESIGN: NailDesignState = {
  nailCount: 5,
  showCuticles: false,
  baseColorFamily: BaseColorFamily.Pink,
  customColor: '#ffb7b2',
  useCustomColor: false,
  shape: NailShape.Almond,
  length: NailLength.Medium,
  finish: NailFinish.Glossy,
  artStyle: NailArtStyle.SolidColor,
  patternPrompt: '',
};

declare global {
  interface Window {
    nailArtSettings?: {
      apiKey: string;
      assetsUrl: string;
    };
  }
}
