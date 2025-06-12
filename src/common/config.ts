import { LayerTypeKey } from "./types";

export const Depth = {
  Background: 1,
  Collision: 2,
  Trigger: 3,
  Foreground: 3,
  Character: 3,
  Objects: 3,
  Indicators: 6,
  Hud: 7,
  Overlay: 8,
} as const satisfies Record<
  LayerTypeKey | "Character" | "Hud" | "Indicators" | "Objects" | "Overlay" | "Trigger",
  number
>;

export const ActionZoneSize = 60;
