import { Area } from "./types";

export const LayerType = {
  Collision: "collision",
} as const;

type LayerType = (typeof LayerType)[keyof typeof LayerType];

const AreaLayer = {
  "house-collision": "collision/collision-1",
} as const satisfies Partial<Record<`${Area}-${LayerType}`, string>>;

export function getAreaLayer(area: Area, type: LayerType) {
  return AreaLayer[`${area}-${type}`];
}
