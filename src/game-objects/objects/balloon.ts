import { getTextureAnimation, Texture, TextureKey } from "../../common/assets";
import { Depth } from "../../common/config";
import { BaseObject } from "./base-object";

type Color = "Blue" | "Green" | "Red" | "Yellow";

type Config = {
  color: Color;
  scene: Phaser.Scene;
  x: number;
  y: number;
};

export class Balloon extends BaseObject {
  private static getTexture(color: Color): [TextureKey, Texture] {
    const key: TextureKey = `${color}Balloon`;

    return [key, Texture[key]];
  }

  #color: Color;
  public readonly isInteractable = true;
  public readonly isMovable = true;

  constructor({ color, ...config }: Config) {
    const [textureKey, texture] = Balloon.getTexture(color);

    super({ ...config, texture });

    this.#color = color;

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.setDepth(Depth.Objects);

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
