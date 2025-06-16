import Phaser from "phaser";
import { Depth } from "../../../common/config";
import { assertsHasBody, Body, GameObject, InteractionType } from "../../../common/types";
import { InteractableComponent } from "./interactable-component";
import { isPersistable, PersistableComponent, PersistableProperties } from "../common/persistable-component";
import { GameStateManager } from "../../../manager/game-state-manager";
import { getDepth } from "../../../common/utils";

type Config = {
  host: GameObject;
  baseDepth?: number;
  drag?: number;
  maxVelocity?: number;
};

export class PushableComponent extends InteractableComponent<typeof InteractionType.Push> {
  declare host: GameObject & { body: Body };

  #baseDepth: number;
  #isBeingPushed: boolean;
  #lastPosition: [x: number, y: number];
  #isHostPersistable: false | PersistableComponent<PersistableProperties>;

  constructor(config: Config) {
    const { host, baseDepth = Depth.Objects, drag = 200, maxVelocity = 300 } = config;

    super({ host, type: InteractionType.Push });

    this.#baseDepth = baseDepth;
    this.#isBeingPushed = false;
    this.#lastPosition = [this.host.x, this.host.y];

    assertsHasBody(this.host);

    this.host.setDepth(getDepth(this.host.y, this.#baseDepth));
    this.host.setDrag(drag).setMaxVelocity(maxVelocity);

    this.host.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.host.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.host.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
    });

    this.#isHostPersistable = isPersistable(this.host) ? this.host.isPersistable : false;
  }

  get isBeingPushed(): boolean {
    return this.#isBeingPushed;
  }

  public update(): void {
    const isXChanged = this.host.x !== this.#lastPosition[0];
    const isYChanged = this.host.y !== this.#lastPosition[1];

    this.#isBeingPushed = isXChanged || isYChanged;
    this.#lastPosition = [this.host.x, this.host.y];

    if (this.#isBeingPushed && this.#isHostPersistable) {
      const persistenceProperties = this.#isHostPersistable.toPersistenceProperties();

      GameStateManager.instance[GameStateManager.instance.area].objects[persistenceProperties.id] =
        persistenceProperties;
    }

    if (!isYChanged) return;

    this.host.setDepth(getDepth(this.host.y, this.#baseDepth));
  }
}

export interface Pushable {
  isInteractable: PushableComponent;
}

export function isPushable<T>(object: T): object is T & Pushable {
  if (!object) return false;
  if (typeof object !== "object") return false;
  if (!("isInteractable" in object)) return false;
  if (typeof object.isInteractable !== "object") return false;
  if (!(object.isInteractable instanceof PushableComponent)) return false;

  return object.isInteractable.canBeInteractedWith;
}
