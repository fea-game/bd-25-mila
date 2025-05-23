import Phaser from "phaser";
import { Depth } from "../../../common/config";
import { assertsHasBody, Body, GameObject } from "../../../common/types";
import { BaseGameObjectComponent } from "../base-game-object-component";

type Config = {
  host: GameObject;
  baseDepth?: number;
  drag?: number;
  maxVelocity?: number;
};

export class PushableComponent extends BaseGameObjectComponent {
  private static getDepth(y: number, baseDepth: number): number {
    return baseDepth + y / 10000;
  }

  declare host: GameObject & { body: Body };

  #baseDepth: number;
  #canBePushed: boolean;
  #isBeingPushed: boolean;
  #lastPosition: [x: number, y: number];

  constructor(config: Config) {
    const { host, baseDepth = Depth.Objects, drag = 200, maxVelocity = 300 } = config;

    super(host);

    this.#baseDepth = baseDepth;
    this.#canBePushed = true;
    this.#isBeingPushed = false;
    this.#lastPosition = [this.host.x, this.host.y];

    assertsHasBody(this.host);

    this.host.setDepth(PushableComponent.getDepth(this.host.y, this.#baseDepth));
    this.host.setDrag(drag).setMaxVelocity(maxVelocity);

    this.host.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.host.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.host.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
    });
  }

  get canBePushed(): boolean {
    return this.#canBePushed;
  }
  set canBePushed(value: boolean) {
    if (value === this.#canBePushed) return;

    this.#canBePushed = value;
  }

  get isBeingPushed(): boolean {
    return this.#isBeingPushed;
  }

  public update(): void {
    const isXChanged = this.host.x !== this.#lastPosition[0];
    const isYChanged = this.host.y !== this.#lastPosition[1];

    this.#isBeingPushed = isXChanged || isYChanged;
    this.#lastPosition = [this.host.x, this.host.y];

    if (!isYChanged) return;

    this.host.setDepth(PushableComponent.getDepth(this.host.y, this.#baseDepth));
  }
}
