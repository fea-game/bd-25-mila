import { GameObject } from "../../../common/types";
import { BaseGameObjectComponent } from "../base-game-object-component";
import { Actionable } from "../object/actionable-component";

export class ActionComponent extends BaseGameObjectComponent {
  declare host: GameObject & Actor;

  #focused: Actionable | undefined;

  constructor(host: GameObject) {
    super(host);
  }

  public focus(object: Actionable): void {
    this.#focused = object;
  }

  public unfocus(): void {
    if (!this.#focused) return;

    this.#focused = undefined;
  }

  public get focused(): Actionable | undefined {
    return this.#focused;
  }
}

export interface Actor {
  isActor: ActionComponent;
}

export function isActor<T>(object: T): object is T & Actor {
  if (!object) return false;
  if (typeof object !== "object") return false;
  if (!("isActor" in object)) return false;
  if (!object.isActor) return false;
  if (typeof object.isActor !== "object") return false;

  return object.isActor instanceof ActionComponent;
}
