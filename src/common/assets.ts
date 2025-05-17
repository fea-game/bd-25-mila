import { Area, Direction, LayerTypeKey } from "./types";

export const Character = {
  Player: "player",
} as const;

type CharacterKey = keyof typeof Character;
export type Character = (typeof Character)[CharacterKey];

export const Texture = {
  Player: "character",
  BlueBalloon: "animated-objects",
  GreenBalloon: "animated-objects",
  RedBalloon: "animated-objects",
  YellowBalloon: "animated-objects",
} as const satisfies Record<CharacterKey | string, string>;

export type TextureKey = keyof typeof Texture;
export type Texture = (typeof Texture)[TextureKey];

export const AnimatedTextures: Array<Texture> = [Texture.Player, Texture.YellowBalloon];

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

const CharacterAnimation = {
  "player-idle-down": "player-idle-down",
  "player-idle-left": "player-idle-left",
  "player-idle-right": "player-idle-right",
  "player-idle-up": "player-idle-up",
  "player-walk-down": "player-walk-down",
  "player-walk-left": "player-walk-left",
  "player-walk-right": "player-walk-right",
  "player-walk-up": "player-walk-up",
} as const satisfies Record<`${Character}-${AnimationType}-${Direction}`, string>;

type CharacterAnimation = (typeof CharacterAnimation)[keyof typeof CharacterAnimation];

export function getCharacterAnimation(
  character: Character,
  animation: AnimationType,
  direction: Direction
): CharacterAnimation {
  return CharacterAnimation[`${character}-${animation}-${direction}`];
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
