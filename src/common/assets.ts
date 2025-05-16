import { Area } from "./types";

export const Texture = {
  Player: "character",
  HouseCollisionLayer: "interior",
} as const;

type Texture = (typeof Texture)[keyof typeof Texture];

export const Animation = {
  character: {
    url: "assets/images/characters/character.animations.json",
  },
} as const satisfies Partial<Record<Texture, { url: string }>>;

export const ImageType = {
  Background: "background",
  Collision: "collision",
  Foreground: "foreground",
  Objects: "objects",
} as const;

type ImageType = (typeof ImageType)[keyof typeof ImageType];

const AreaImage = {
  "house-background": "house-background",
  "house-collision": "house-collision",
  "house-foreground": "house-foreground",
  "house-objects": "house-objects",
} as const satisfies Partial<Record<`${Area}-${ImageType}`, string>>;

export function getAreaImage(area: Area, type: ImageType) {
  return AreaImage[`${area}-${type}`];
}

export const Map = {
  "house-map": "house.map",
} as const;

export const TilesetType = {
  Collision: "collision",
} as const;

type TilesetType = (typeof TilesetType)[keyof typeof TilesetType];

const AreaTileset = {
  "house-collision": "collision",
} as const satisfies Partial<Record<`${Area}-${TilesetType}`, string>>;

export function getAreaTileset(area: Area, type: TilesetType) {
  return AreaTileset[`${area}-${type}`];
}
