import Phaser from "phaser";
import { ActionZoneSize } from "../../../common/config";
import { assertsHasBody, Body, GameObject, InteractionType } from "../../../common/types";
import { BaseGameObjectComponent } from "../base-game-object-component";
import { EventBus } from "../../../common/event-bus";

type Config = {
  host: GameObject & Interactable;
  type: InteractionType;
  interact: (actor: GameObject) => void;
};

export class InteractableComponent extends BaseGameObjectComponent {
  declare host: GameObject & { body: Body } & Interactable;

  private static getZoneBounds(host: GameObject & { body: Body }): {
    x: number;
    y: number;
    width: number;
    height: number;
  } {
    const { body } = host;

    const zoneWidth = body.width + ActionZoneSize;
    const zoneHeight = body.height + ActionZoneSize;

    // Position of the top-left of the body in world space
    const topLeftX = host.x - host.displayOriginX + body.offset.x;
    const topLeftY = host.y - host.displayOriginY + body.offset.y;

    const centerX = topLeftX + body.width / 2;
    const centerY = topLeftY + body.height / 2;

    return {
      x: centerX,
      y: centerY,
      width: zoneWidth,
      height: zoneHeight,
    };
  }

  #canBeInteractedWith: boolean;
  #type: InteractionType;
  #trigger: InteractionTrigger;

  public readonly interact: (actor: GameObject) => void;

  constructor(config: Config) {
    super(config.host);

    this.#type = config.type;
    this.interact = (actor: GameObject) => {
      if (!this.#canBeInteractedWith) return;

      config.interact(actor);

      EventBus.instance.emit("interacted", { actor, interactedWith: this.host });
    };

    assertsHasBody(this.host);

    const { x, y, width, height } = InteractableComponent.getZoneBounds(this.host);
    const trigger: any = this.host.scene.add.zone(x, y, width, height);
    trigger.host = this.host;
    this.#trigger = trigger;
    this.host.scene.physics.add.existing(this.#trigger);

    this.host.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.host.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.host.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
    });
  }

  get canBeInteractedWith(): boolean {
    return this.#canBeInteractedWith;
  }

  set canBeInteractedWith(value: boolean) {
    if (value === this.#canBeInteractedWith) return;

    this.#canBeInteractedWith = value;

    console.log("CAN BE INTERACTED WITH", value, this);

    if (this.#canBeInteractedWith) {
      // TODO: show indicator
    } else {
      // TODO: hide indicator
    }
  }

  get type(): InteractionType {
    return this.#type;
  }

  get trigger(): Phaser.GameObjects.GameObject {
    return this.#trigger;
  }

  public update(): void {
    const { x, y } = InteractableComponent.getZoneBounds(this.host);

    if (x === this.#trigger.x && y === this.#trigger.y) {
      return;
    }

    this.#trigger.x = x;
    this.#trigger.y = y;
  }
}

export interface Interactable {
  isInteractable: InteractableComponent;
}

export function isInteractable<T>(object: T): object is T & InteractionTrigger {
  if (!object) return false;
  if (typeof object !== "object") return false;
  if (!("host" in object)) return false;
  if (!object.host) return false;
  if (typeof object.host !== "object") return false;
  if (!("isInteractable" in object.host)) return false;
  if (!object.host.isInteractable) return false;
  if (typeof object.host.isInteractable !== "object") return false;

  return object.host.isInteractable instanceof InteractableComponent;
}

export type InteractionTrigger = Phaser.GameObjects.Zone & { readonly host: Interactable };
