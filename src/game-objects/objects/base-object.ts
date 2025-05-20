import Phaser from "phaser";
import { GameObject } from "../../common/types";
import { InteractableComponent } from "../../components/game-object/object/interactable-component";

type Config = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
};

export abstract class BaseObject extends GameObject {
  public abstract isMovable: boolean;
  public abstract isInteractable: false | InteractableComponent;

  constructor(config: Config) {
    super(config.scene, config.x, config.y, config.texture);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setOrigin(0, 1);
  }
}
