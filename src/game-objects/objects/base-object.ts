import Phaser from "phaser";
import { GameObject } from "../../common/types";
import { InteractableObjectComponent } from "../../components/game-object/object/interactable-object-component";

type Config = {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
  isInteractable?: false | Omit<ConstructorParameters<typeof InteractableObjectComponent>[0], "host">;
  isMovable?: boolean;
};

export abstract class BaseObject extends GameObject {
  #isInteractable: false | InteractableObjectComponent;
  #isMovable: boolean = false;

  constructor(config: Config) {
    super(config.scene, config.x, config.y, config.texture);

    this.#isInteractable = config.isInteractable
      ? new InteractableObjectComponent({ host: this, ...config.isInteractable })
      : false;
    this.#isMovable = config.isMovable ?? false;

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setOrigin(0, 1).setImmovable(!this.#isMovable);
  }

  get isInteractable(): InteractableObjectComponent | false {
    return this.#isInteractable;
  }

  get isMovable(): boolean {
    return this.#isMovable;
  }
}
