import Phaser from "phaser";
import { GameObject } from "../../common/types";

type Config = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
};

export abstract class BaseObject extends GameObject {
  constructor(config: Config) {
    super(config.scene, config.x, config.y, config.texture);
  }

  abstract get isInteractable(): boolean;
  abstract get isMovable(): boolean;
}
