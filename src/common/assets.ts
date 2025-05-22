import { Area, Direction, LayerTypeKey } from "./types";

export const Character = {
  Amelie: "amelie",
  Cynthia: "cynthia",
  Mila: "mila",
  Tobias: "tobias",
} as const;

type CharacterKey = keyof typeof Character;
export type Character = (typeof Character)[CharacterKey];

export const Texture = {
  Amelie: "amelie",
  Cynthia: "cynthia",
  Mila: "mila",
  Tobias: "tobias",
  BlueBalloon: "animated-objects",
  GreenBalloon: "animated-objects",
  RedBalloon: "animated-objects",
  YellowBalloon: "animated-objects",
  Cake: "cake",
  PlateWithCake: "plate-with-cake",
  PlateWithoutCake: "plate-without-cake",
  ToiletClosed: "toilet-closed",
  ToiletOpened: "toilet-opened",
} as const satisfies Record<CharacterKey | string, string>;

export type TextureKey = keyof typeof Texture;
export type Texture = (typeof Texture)[TextureKey];

export const AnimatedTextures: Array<Texture> = [
  Texture.Amelie,
  Texture.Cynthia,
  Texture.Mila,
  Texture.Tobias,
  Texture.YellowBalloon,
];

export const TextureAnimation = {
  BlueBalloon: "blue-balloon",
  GreenBalloon: "green-balloon",
  RedBalloon: "red-balloon",
  YellowBalloon: "yellow-balloon",
} as const satisfies Partial<Record<TextureKey, string>>;

type TextureAnimation = (typeof TextureAnimation)[keyof typeof TextureAnimation];

export function getTextureAnimation(texture: TextureKey): TextureAnimation {
  return TextureAnimation[texture];
}

export const AnimationType = {
  Idle: "idle",
  Walk: "walk",
} as const;

export type AnimationTypeKey = keyof typeof AnimationType;
export type AnimationType = (typeof AnimationType)[AnimationTypeKey];

type CharacterAnimation = `${Character}-${AnimationType}-${Direction}`;

export function getCharacterAnimation(
  character: Character,
  animation: AnimationType,
  direction: Direction
): CharacterAnimation {
  return `${character}-${animation}-${direction}`;
}

export const ImageType = {
  Background: "background",
  Collision: "collision",
  Foreground: "foreground",
} as const satisfies Record<LayerTypeKey, string>;

type ImageType = (typeof ImageType)[keyof typeof ImageType];

const AreaImage = {
  "house-background": "house-background",
  "house-collision": "house-collision",
  "house-foreground": "house-foreground",
} as const satisfies Partial<Record<`${Area}-${ImageType}`, string>>;

type AreaImage = (typeof AreaImage)[keyof typeof AreaImage];

export function getAreaImage(area: Area, type: ImageType): AreaImage {
  return AreaImage[`${area}-${type}`];
}

const AreaMap = {
  forest: "forest-map",
  house: "house-map",
  neighborhood: "neighborhood-map",
} as const satisfies Record<Area, string>;

type AreaMap = (typeof AreaMap)[keyof typeof AreaMap];

export function getAreaMap(area: Area): AreaMap {
  return AreaMap[area];
}

export const TilesetType = {
  Collision: "collision",
} as const satisfies Partial<Record<LayerTypeKey, string>>;

type TilesetType = (typeof TilesetType)[keyof typeof TilesetType];

const AreaTileset = {
  "house-collision": "collision",
} as const satisfies Partial<Record<`${Area}-${TilesetType}`, string>>;

type AreaTileset = (typeof AreaTileset)[keyof typeof AreaTileset];

export function getAreaTileset(area: Area, type: TilesetType): AreaTileset {
  return AreaTileset[`${area}-${type}`];
}
