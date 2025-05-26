import { GameObject, InteractionType } from "../../../common/types";
import { BaseGameObjectComponent } from "../base-game-object-component";

type Config<T extends InteractionType> = {
  host: GameObject;
  type: T;
};

export abstract class InteractableComponent<T extends InteractionType> extends BaseGameObjectComponent {
  #canBeInteractedWith: boolean;

  public readonly type: InteractionType;

  constructor(config: Config<T>) {
    super(config.host);

    this.#canBeInteractedWith = true;
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
