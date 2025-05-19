import Phaser from "phaser";

export const SceneKey = {
  Preload: "preload",
  Game: "game",
} as const;

export const Area = {
  House: "house",
  Neighborhood: "neighborhood",
  Forest: "forest",
} as const;

export type Area = (typeof Area)[keyof typeof Area];

export const LayerType = {
  Background: "background",
  Collision: "collision",
  Foreground: "foreground",
} as const;

export type LayerTypeKey = keyof typeof LayerType;
type LayerType = (typeof LayerType)[LayerTypeKey];

const AreaLayer = {
  "house-collision": "collision/collision-1",
} as const satisfies Partial<Record<`${Area}-${LayerType}`, string>>;

type AreaLayer = (typeof AreaLayer)[keyof typeof AreaLayer];

export function getAreaLayer(area: Area, type: LayerType): AreaLayer {
  return AreaLayer[`${area}-${type}`];
}

export abstract class GameObject extends Phaser.Physics.Arcade.Sprite {}
export type Body = Phaser.Physics.Arcade.Body;

export const Direction = {
  Down: "down",
  Left: "left",
  Right: "right",
  Up: "up",
} as const;

export type DirectionKey = keyof typeof Direction;
export type Direction = (typeof Direction)[DirectionKey];

export const InteractionType = {
  Action: "action",
} as const;

export type InteractionType = (typeof InteractionType)[keyof typeof InteractionType];
