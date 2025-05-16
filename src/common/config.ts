import { LayerTypeKey } from "./types";

export const Depth = {
  Background: 0,
  Collision: 1,
  Player: 2,
  Foreground: 3,
  Objects: 4,
} as const satisfies Record<LayerTypeKey | "Player", number>;
