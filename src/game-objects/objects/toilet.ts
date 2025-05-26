import { Texture } from "../../common/assets";
import { BaseObject } from "./base-object";
import * as tiled from "../../tiled/types";
import { InteractionType } from "../../common/types";
import { Actionable, ActionableComponent } from "../../components/game-object/object/actionable-component";

type Config = {
  scene: Phaser.Scene;
  properties: Pick<tiled.Toilet, "x" | "y" | "properties">;
};

export class Toilet extends BaseObject implements Actionable {
  private static getTexture(isOpened: boolean): Texture {
    return Texture[`Toilet${isOpened ? "Opened" : "Closed"}`];
  }

  private static ShortenBodyBy = 54;

  #isInteractable: ActionableComponent;
  #isOpened: boolean;

  public readonly isPushable = false;

  constructor({
    scene,
    properties: {
      x,
      y,
      properties: { isOpened },
    },
  }: Config) {
    super({ scene, x, y, texture: Toilet.getTexture(isOpened) });

    this.#isOpened = isOpened;

    this.setBodySize(this.displayWidth, this.displayHeight - Toilet.ShortenBodyBy).setOffset(0, Toilet.ShortenBodyBy);
    this.setImmovable(true);
    this.setPushable(false);
    this.#isInteractable = new ActionableComponent({
      host: this,
      type: InteractionType.Action,
      interact: () => {
        this.isOpened = !this.#isOpened;
      },
    });
  }

  get isInteractable(): ActionableComponent {
    return this.#isInteractable;
  }

  public get isOpened(): boolean {
    return this.#isOpened;
  }
  public set isOpened(isOpened: boolean) {
    this.#isOpened = isOpened;

    this.setTexture(Toilet.getTexture(isOpened));
  }
}
