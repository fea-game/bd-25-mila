import { Texture } from "../../common/assets";
import { BaseObject } from "./base-object";
import * as tiled from "../../tiled/types";

type Config = {
  scene: Phaser.Scene;
  properties: Pick<tiled.Plate, "x" | "y"> & tiled.Plate["properties"];
};

export class Plate extends BaseObject {
  private static getTexture(isWithCake: Config["properties"]["isWithCake"]): Texture {
    return isWithCake ? Texture.PlateWithCake : Texture.PlateWithoutCake;
  }

  public readonly isInteractable = false;
  public readonly isPersistable = false;

  #isWithCake: boolean;

  constructor({ scene, properties: { x, y, isWithCake } }: Config) {
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
