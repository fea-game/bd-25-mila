import { getTextureAnimation, Texture, TextureKey } from "../../common/assets";
import { BaseObject } from "./base-object";
import * as tiled from "../../tiled/types";

type Color = tiled.Balloon["properties"]["color"];

type Config = {
  scene: Phaser.Scene;
  properties: Pick<tiled.Balloon, "x" | "y" | "properties">;
};

export class Balloon extends BaseObject {
  private static getTexture(color: Color): [TextureKey, Texture] {
    const key: TextureKey = `${color}Balloon`;

    return [key, Texture[key]];
  }

  #color: Color;

  public readonly isInteractable = false;
  public readonly isMovable = true;

  constructor({
    scene,
    properties: {
      x,
      y,
      properties: { color },
    },
  }: Config) {
    const [textureKey, texture] = Balloon.getTexture(color);

    super({ scene, x, y, texture });

    this.#color = color;

    this.setDrag(200).setMaxVelocity(300);

    this.play(
      {
        key: getTextureAnimation(textureKey),
        repeat: -1,
      },
      true
    );
  }

  public get color(): Color {
    return this.#color;
  }
  public set color(color: Color) {
    this.#color = color;

    const [textureKey, texture] = Balloon.getTexture(color);

    this.setTexture(texture).play(
      {
        key: getTextureAnimation(textureKey),
        repeat: -1,
      },
      true
    );
  }
}
