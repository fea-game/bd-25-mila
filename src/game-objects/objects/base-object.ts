import Phaser from "phaser";
import { GameObject } from "../../common/types";
import { InteractableComponent } from "../../components/game-object/object/interactable-component";
import { PushableComponent } from "../../components/game-object/object/pushable-component";
import { Depth } from "../../common/config";

type Config = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
};

export abstract class BaseObject extends GameObject {
  public abstract isInteractable: false | InteractableComponent;
  public abstract isPushable: false | PushableComponent;

  constructor(config: Config) {
    super(config.scene, config.x, config.y, config.texture);

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.setDepth(Depth.Objects);
    this.setOrigin(0, 1);
  }
}
