import { Texture } from "../../common/assets";
import { BaseObject } from "./base-object";
import * as tiled from "../../tiled/types";
import { InteractionType } from "../../common/types";

type Config = {
  scene: Phaser.Scene;
  properties: Pick<tiled.Toilet, "x" | "y" | "properties">;
};

export class Toilet extends BaseObject {
  private static getTexture(isOpened: boolean): Texture {
    return Texture[`Toilet${isOpened ? "Opened" : "Closed"}`];
  }

  #isOpened: boolean;

  constructor({
    scene,
    properties: {
      x,
      y,
      properties: { isOpened },
    },
  }: Config) {
    super({
      scene,
      x,
      y,
      texture: Toilet.getTexture(isOpened),
      isInteractable: { type: InteractionType.Action },
    });

    this.#isOpened = isOpened;
  }

  public get isOpened(): boolean {
    return this.#isOpened;
  }
  public set isOpened(isOpened: boolean) {
    this.#isOpened = isOpened;

    this.setTexture(Toilet.getTexture(isOpened));
  }
}
