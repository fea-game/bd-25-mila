import { Texture } from "../../common/assets";
import { BaseObject } from "./base-object";
import * as tiled from "../../tiled/types";
import { Depth } from "../../common/config";

type Config = {
  scene: Phaser.Scene;
  properties: Pick<tiled.Plate, "x" | "y" | "properties">;
};

export class Plate extends BaseObject {
  private static getTexture(isWithCake: Config["properties"]["properties"]["isWithCake"]): Texture {
    return isWithCake ? Texture.PlateWithCake : Texture.PlateWithoutCake;
  }

  public readonly isInteractable = false;

  #isWithCake: boolean;

  constructor({
    scene,
    properties: {
      x,
      y,
      properties: { isWithCake },
    },
  }: Config) {
    super({ scene, x, y, texture: Plate.getTexture(isWithCake) });

    this.#isWithCake = isWithCake;

    this.setImmovable(true);
  }

  public get isWithCake(): boolean {
    return this.#isWithCake;
  }
  public set isWithCake(value: boolean) {
    if (value === this.#isWithCake) return;

    this.#isWithCake = value;

    this.setTexture(Plate.getTexture(this.#isWithCake));
  }
}
