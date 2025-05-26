import Phaser from "phaser";
import { GameObject, InteractionType } from "../../../common/types";
import { BaseGameObjectComponent } from "../base-game-object-component";

type Config<T extends InteractionType> = {
  host: GameObject;
  type: T;
  id?: string;
};

export abstract class InteractableComponent<T extends InteractionType> extends BaseGameObjectComponent {
  #canBeInteractedWith: boolean;

  public readonly id: string;
  public readonly type: InteractionType;

  constructor(config: Config<T>) {
    super(config.host);

    this.#canBeInteractedWith = true;
    this.id = config.id ?? `${this.constructor.name}-${Phaser.Math.RND.uuid()}`;
    this.type = config.type;
  }

  public get canBeInteractedWith(): boolean {
    return this.#canBeInteractedWith;
  }
  public set canBeInteractedWith(value: boolean) {
    if (value === this.#canBeInteractedWith) return;

    this.#canBeInteractedWith = value;
  }
}
