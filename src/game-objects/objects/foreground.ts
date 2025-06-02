import { BaseObject } from "./base-object";
import * as tiled from "../../tiled/types";
import { Depth } from "../../common/config";

type Config = {
  scene: Phaser.Scene;
  properties: Pick<tiled.Foreground, "x" | "y"> & tiled.Foreground["properties"];
};

export class Foreground extends BaseObject {
  public readonly isInteractable = false;
  public readonly isPersistable = false;

  constructor({ scene, properties: { x, y, texture } }: Config) {
    super({ scene, x, y, texture, baseDepth: Depth.Foreground });

    this.setImmovable(true);
  }
}
