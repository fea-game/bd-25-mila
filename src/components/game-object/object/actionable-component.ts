import Phaser from "phaser";
import { ActionZoneSize } from "../../../common/config";
import { assertsHasBody, Body, GameObject, InteractionType } from "../../../common/types";
import { Actor } from "../character/action-component";
import { Indicator } from "../../../game-objects/helper/indicator";
import { InteractableComponent } from "./interactable-component";

type Config = {
  host: GameObject & Actionable;
  type: InteractionType;
  interact: (actor: Actor, onFinished?: () => void) => void;
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

  public readonly interact: (actor: Actor, onFinished?: () => void) => void;

  constructor(config: Config) {
    super({ host: config.host, type: InteractionType.Action });

    this.#isFocused = false;
    this.interact = (actor: Actor, onFinished?: () => void) => {
      if (!this.#isFocused) return;

      config.interact(actor, onFinished);
    };

    assertsHasBody(this.host);

    const { x, y, width, height } = ActionableComponent.getZoneBounds(this.host);
    const trigger: any = this.host.scene.add.zone(x, y, width, height);
    trigger.host = this.host;
    this.#trigger = trigger;
    this.host.scene.physics.add.existing(this.#trigger);

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
  }

  get trigger(): Phaser.GameObjects.GameObject {
    return this.#trigger;
  }

  public focus(actor: Actor): void {
    if (!this.canBeInteractedWith) return;
    if (this.#isFocused) return;

    this.#isFocused = actor;

    this.#indicator = this.#indicator ?? new Indicator({ host: this.host, texture: "controls", frame: 0 });
    this.#indicator.setScale(2).show();
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
  isInteractable: ActionableComponent;
}

export function isActionable<T>(object: T): object is T & Actionable {
  if (!object) return false;
  if (typeof object !== "object") return false;
  if (!("isInteractable" in object)) return false;
  if (typeof object.isInteractable !== "object") return false;

  return object.isInteractable instanceof ActionableComponent;
}

export function isActionTrigger<T>(object: T): object is T & ActionTrigger {
  if (!object) return false;
  if (typeof object !== "object") return false;
  if (!("host" in object)) return false;
  if (!object.host) return false;
  if (typeof object.host !== "object") return false;
  if (!("isInteractable" in object.host)) return false;
  if (!object.host.isInteractable) return false;
  if (typeof object.host.isInteractable !== "object") return false;
  if (!(object.host.isInteractable instanceof ActionableComponent)) return false;

  return object.host.isInteractable.canBeInteractedWith;
}

export type ActionTrigger = Phaser.GameObjects.Zone & {
  readonly host: Actionable;
};
