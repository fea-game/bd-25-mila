import { LayerTypeKey } from "./types";

export const Depth = {
  Background: 1,
  Collision: 2,
  Player: 3,
  Foreground: 4,
  Objects: 5,
  Indicators: 6,
} as const satisfies Record<LayerTypeKey | "Indicators" | "Objects" | "Player", number>;

export const ActionZoneSize = 60;
