import Phaser from "phaser";
import { ActionZoneSize } from "../../../common/config";
import { assertsHasBody, Body, GameObject, InteractionType } from "../../../common/types";
import { Actor } from "../character/action-component";
import { Indicator } from "../../../game-objects/helper/indicator";
import { InteractableComponent } from "./interactable-component";
import { EventBus } from "../../../common/event-bus";
import { isPersistable, PersistableComponent, PersistableProperties } from "../common/persistable-component";
import { GameStateManager } from "../../../manager/game-state-manager";

type Config = {
  host: GameObject & Actionable;
  interact: (actor: GameObject & Actor, onFinished?: () => void) => void;
  id?: string;
  canBeInteractedWith?: boolean;
};

export class ActionableComponent extends InteractableComponent<typeof InteractionType.Action> {
  declare host: GameObject & { body: Body } & Actionable;

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

  #isFocused: Actor | false;
  #trigger: ActionTrigger;
  #indicator?: Indicator;
  #isHostPersistable: false | PersistableComponent<PersistableProperties>;

  public readonly interact: (actor: GameObject & Actor, onFinished?: () => void) => void;

  constructor(config: Config) {
    super({
      host: config.host,
      type: InteractionType.Action,
      id: config.id,
      canBeInteractedWith: config.canBeInteractedWith,
    });

    this.#isFocused = false;
    this.interact = (actor: GameObject & Actor, onFinished?: () => void) => {
      if (!this.#isFocused) return;

      EventBus.acted({ actor: this.#isFocused, interactedWith: this.host });

      config.interact(actor, onFinished);
    };

    assertsHasBody(this.host);

    const { x, y, width, height } = ActionableComponent.getZoneBounds(this.host);
    const trigger: any = this.host.scene.add.zone(x, y, width, height);
    trigger.host = this.host;
    this.#trigger = trigger;
    this.host.scene.physics.add.existing(this.#trigger);

    this.#isHostPersistable = isPersistable(this.host) ? this.host.isPersistable : false;

    this.host.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.host.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.host.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
    });
  }

  public override get canBeInteractedWith(): boolean {
    return super.canBeInteractedWith;
  }

  public override set canBeInteractedWith(value: boolean) {
    if (value === this.canBeInteractedWith) return;

    super.canBeInteractedWith = value;

    if (!this.canBeInteractedWith) {
      this.unfocus();
    }

    if (this.#isHostPersistable) {
      const persistenceProperties = this.#isHostPersistable.toPersistenceProperties();

      GameStateManager.instance[GameStateManager.instance.area].objects[persistenceProperties.id] =
        persistenceProperties;
    }
  }

  get trigger(): ActionTrigger {
    return this.#trigger;
  }

  public focus(actor: Actor): void {
    if (!this.canBeInteractedWith) return;
    if (this.#isFocused) return;

    this.#isFocused = actor;

    this.#indicator =
      this.#indicator ?? new Indicator({ host: this.host, content: [{ texture: "controls", frame: 0 }] });
    this.#indicator.show();
  }

  public unfocus(): void {
    if (!this.#isFocused) return;

    this.#isFocused = false;
    this.#indicator?.hide();
    this.#indicator = undefined;
  }

  public getFocuser(): Actor | undefined {
    if (!this.#isFocused) return;

    return this.#isFocused;
  }

  public update(): void {
    const { x, y } = ActionableComponent.getZoneBounds(this.host);

    if (x === this.#trigger.x && y === this.#trigger.y) {
      return;
    }

    this.#trigger.x = x;
    this.#trigger.y = y;
    this.#indicator?.update();
  }
}

export interface Actionable {
  id: string;
  isInteractable: ActionableComponent;
}

export function isActionable<T>(object: T): object is T & Actionable {
  if (!object) return false;
  if (typeof object !== "object") return false;
  if (!("isInteractable" in object)) return false;
  if (typeof object.isInteractable !== "object") return false;

  return object.isInteractable instanceof ActionableComponent;
}

export function isActionTrigger<T>(value: T): value is T & ActionTrigger {
  try {
    assertsIsActionTrigger(value);

    return true;
  } catch {
    return false;
  }
}

export function assertsIsActionTrigger<T>(object: T): asserts object is T & ActionTrigger {
  if (!object) throw new Error("Value is not present!");
  if (typeof object !== "object") throw new Error("Value is not an object!");
  if (!("host" in object)) throw new Error("Value is has no property host!");
  if (!object.host) throw new Error("Host is not present!");
  if (typeof object.host !== "object") throw new Error("Host is not an object!");
  if (!("isInteractable" in object.host)) throw new Error("Host is not interactable!");
  if (!object.host.isInteractable) throw new Error("Host.isInteractable is not present!");
  if (typeof object.host.isInteractable !== "object") throw new Error("Host.isInteractable is not an object!");
  if (!(object.host.isInteractable instanceof ActionableComponent))
    throw new Error("Host.isInteractable is not an ActionableComponent!");
  if (!object.host.isInteractable.canBeInteractedWith) throw new Error("Host can't be interacted with!");
}

export type ActionTrigger = Phaser.GameObjects.Zone & {
  readonly host: Actionable;
  readonly body: Body;
};
