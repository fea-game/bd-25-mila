import { GameObject, InteractionType } from "../../../common/types";
import { InteractableComponent } from "./interactable-component";

type Config = {
  host: GameObject & Contactable;
  id: string;
  canBeInteractedWith?: boolean;
};

export class ContactableComponent extends InteractableComponent<typeof InteractionType.Contact> {
  declare host: GameObject & Contactable;

  constructor(config: Config) {
    super({
      host: config.host,
      type: InteractionType.Contact,
      id: config.id,
      canBeInteractedWith: config.canBeInteractedWith ?? true,
    });
  }
}

export interface Contactable {
  isInteractable: ContactableComponent;
}

export function isContactable<T>(object: T): object is T & Contactable {
  if (!object) return false;
  if (typeof object !== "object") return false;
  if (!("isInteractable" in object)) return false;
  if (typeof object.isInteractable !== "object") return false;

  return object.isInteractable instanceof ContactableComponent;
}
