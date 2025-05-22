import Phaser from "phaser";
import { ActionZoneSize } from "../../../common/config";
import { assertsHasBody, Body, GameObject, InteractionType } from "../../../common/types";
import { BaseGameObjectComponent } from "../base-game-object-component";
import { Actor } from "../character/interaction-component";
import { Indicator } from "../../../game-objects/helper/indicator";

type Config<T extends InteractionType> = {
  host: GameObject & Interactable<T>;
  type: T;
  interact: (actor: Actor<T[]>, onFinished?: () => void) => void;
};

export class InteractableComponent<T extends InteractionType = InteractionType> extends BaseGameObjectComponent {
  declare host: GameObject & { body: Body } & Interactable<T>;

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

  #type: T;
  #canBeInteractedWith: boolean;
  #isFocused: Actor<T[]> | false;
  #trigger: InteractionTrigger<T>;
  #indicator?: Indicator;

  public readonly interact: (actor: Actor<T[]>, onFinished?: () => void) => void;

  constructor(config: Config<T>) {
    super(config.host);

    this.canBeInteractedWith = true;
    this.#isFocused = false;
    this.#type = config.type;
    this.interact = (actor: Actor<T[]>, onFinished?: () => void) => {
      if (!this.#isFocused) return;

      config.interact(actor, onFinished);
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

    if (!this.#canBeInteractedWith) {
      this.unfocus();
    }
  }

  get type(): InteractionType {
    return this.#type;
  }

  get trigger(): Phaser.GameObjects.GameObject {
    return this.#trigger;
  }

  public focus(actor: Actor<T[]>): void {
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

  public getFocuser(): Actor<T[]> | undefined {
    if (!this.#isFocused) return;

    return this.#isFocused;
  }

  public update(): void {
    const { x, y } = InteractableComponent.getZoneBounds(this.host);

    if (x === this.#trigger.x && y === this.#trigger.y) {
      return;
    }

    this.#trigger.x = x;
    this.#trigger.y = y;
    this.#indicator?.update();
  }
}

export interface Interactable<T extends InteractionType> {
  isInteractable: InteractableComponent<T>;
}

export function isInteractable<T, I extends InteractionType = InteractionType>(
  object: T
): object is T & InteractionTrigger<I> {
  if (!object) return false;
  if (typeof object !== "object") return false;
  if (!("host" in object)) return false;
  if (!object.host) return false;
  if (typeof object.host !== "object") return false;
  if (!("isInteractable" in object.host)) return false;
  if (!object.host.isInteractable) return false;
  if (typeof object.host.isInteractable !== "object") return false;
  if (!(object.host.isInteractable instanceof InteractableComponent)) return false;

  return object.host.isInteractable.canBeInteractedWith;
}

export type InteractionTrigger<T extends InteractionType = InteractionType> = Phaser.GameObjects.Zone & {
  readonly host: Interactable<T>;
};
