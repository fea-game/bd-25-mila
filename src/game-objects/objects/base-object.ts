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
  baseDepth?: number;
};

export abstract class BaseObject extends GameObject {
  protected static getDepth(y: number, baseDepth: number): number {
    return baseDepth + y / 10000;
  }

  protected readonly baseDepth: number;

  public abstract isInteractable: false | InteractableComponent;
  public abstract isPushable: false | PushableComponent;

  constructor(config: Config) {
    super(config.scene, config.x, config.y, config.texture);

    this.baseDepth = config.baseDepth ?? Depth.Objects;

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.setDepth(BaseObject.getDepth(this.y, this.baseDepth));
    this.setOrigin(0, 1);
  }
}
