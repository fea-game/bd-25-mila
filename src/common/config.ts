import { LayerTypeKey } from "./types";

export const Depth = {
  Background: 1,
  Collision: 2,
  Character: 3,
  Objects: 3,
  Foreground: 3,
  Indicators: 6,
} as const satisfies Record<LayerTypeKey | "Character" | "Indicators" | "Objects", number>;

export const ActionZoneSize = 60;
