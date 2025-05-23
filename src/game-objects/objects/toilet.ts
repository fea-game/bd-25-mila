import { Texture } from "../../common/assets";
import { BaseObject } from "./base-object";
import * as tiled from "../../tiled/types";
import { InteractionType } from "../../common/types";
import { Interactable, InteractableComponent } from "../../components/game-object/object/interactable-component";
import { Depth } from "../../common/config";

type Config = {
  scene: Phaser.Scene;
  properties: Pick<tiled.Toilet, "x" | "y" | "properties">;
};

export class Toilet extends BaseObject implements Interactable<typeof InteractionType.Action> {
  private static getTexture(isOpened: boolean): Texture {
    return Texture[`Toilet${isOpened ? "Opened" : "Closed"}`];
  }

  private static ShortenBodyBy = 54;

  #isInteractable: InteractableComponent;
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
    this.setDepth(Depth.Objects);
    this.setImmovable(true);
    this.#isInteractable = new InteractableComponent({
      host: this,
      type: InteractionType.Action,
      interact: () => {
        this.isOpened = !this.#isOpened;
      },
    });
  }

  get isInteractable(): InteractableComponent {
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
