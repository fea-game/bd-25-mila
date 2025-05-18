import { LayerTypeKey } from "./types";

export const Depth = {
  Background: 1,
  Collision: 2,
  Objects: 3,
  Player: 3,
  Foreground: 4,
} as const satisfies Record<LayerTypeKey | "Player" | "Objects", number>;
