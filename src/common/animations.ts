export const CharacterAnimation = {
  IdleDown: "idle-down",
  IdleUp: "idle-up",
  IdleLeft: "idle-left",
  IdleRight: "idle-right",
  WalkDown: "walk-down",
  WalkUp: "walk-up",
  WalkLeft: "walk-left",
  WalkRight: "walk-right",
} as const;

export type CharacterAnimation =
  (typeof CharacterAnimation)[keyof typeof CharacterAnimation];
