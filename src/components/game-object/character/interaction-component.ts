import { GameObject, InteractionType } from "../../../common/types";
import { BaseGameObjectComponent } from "../base-game-object-component";
import { Interactable } from "../object/interactable-component";

export class InteractionComponent<T extends InteractionType[] = InteractionType[]> extends BaseGameObjectComponent {
  declare host: GameObject & Actor<T>;

  #focuses: {
    [K in T[number]]?: Interactable<K>;
  } = {};

  public readonly types: T;

  constructor(host: GameObject, types: T) {
    super(host);

    this.types = types;
  }

  public focus<I extends T[number]>(object: Interactable<I>): void {
    this.#focuses[object.isInteractable.type] = object;
  }

  public unfocus<I extends T[number]>(type: I): void {
    if (!this.#focuses[type]) return;

    delete this.#focuses[type];
  }

  public getFocused<I extends T[number]>(type: I): Interactable<I> | undefined {
    return this.#focuses[type];
  }
}

export interface Actor<T extends InteractionType[] = InteractionType[]> {
  isActor: InteractionComponent<T>;
}

export function isActor<T, I extends InteractionType = InteractionType>(object: T, type: I): object is T & Actor<I[]> {
  if (!object) return false;
  if (typeof object !== "object") return false;
  if (!("isActor" in object)) return false;
  if (!object.isActor) return false;
  if (typeof object.isActor !== "object") return false;
  if (!(object.isActor instanceof InteractionComponent)) return false;

  return object.isActor.types.includes(type);
}
