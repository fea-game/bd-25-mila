import Phaser from "phaser";

export const SceneKey = {
  Preload: "preload",
  Game: "game",
} as const;

export type GameObject = Phaser.Physics.Arcade.Sprite;
export type Body = Phaser.Physics.Arcade.Body;
