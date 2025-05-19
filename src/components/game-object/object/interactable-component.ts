import { GameObject, InteractionType } from "../../../common/types";
import { BaseObject } from "../../../game-objects/objects/base-object";
import { BaseGameObjectComponent } from "../base-game-object-component";

type Config = {
  host: BaseObject;
  type: InteractionType;
  canBeInteractedWith?: () => boolean;
  onInteracted?: () => void;
};

export class InteractableComponent extends BaseGameObjectComponent {
  #type: InteractionType;
  #onInteracted?: () => void;
  #canBeInteractedWith: () => boolean;

  constructor(config: Config) {
    super(config.host);

    this.#type = config.type;
    this.#canBeInteractedWith = config.canBeInteractedWith ?? (() => true);
    this.#onInteracted = config.onInteracted;
  }

  get type(): InteractionType {
    return this.#type;
  }

  public interact(): void {
    this.#onInteracted?.();
  }

  public canBeInteractedWith(): boolean {
    return this.#canBeInteractedWith();
  }
}
