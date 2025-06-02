import { getTextureAnimation, Texture, TextureKey } from "../../common/assets";
import { BaseObject } from "./base-object";
import * as tiled from "../../tiled/types";
import { Depth } from "../../common/config";
import { Pushable, PushableComponent } from "../../components/game-object/object/pushable-component";
import { Persistable, PersistableComponent } from "../../components/game-object/common/persistable-component";

type Color = tiled.Balloon["properties"]["color"];

type Config = {
  scene: Phaser.Scene;
  properties: Pick<tiled.Balloon, "x" | "y"> & tiled.Balloon["properties"];
};

type Properties = {
  id: string;
  x: number;
  y: number;
};

export class Balloon extends BaseObject<Properties> implements Persistable<Properties>, Pushable {
  private static getTexture(color: Color): [TextureKey, Texture] {
    const key: TextureKey = `${color}Balloon`;

    return [key, Texture[key]];
  }

  public readonly id: string;

  #color: Color;
  #isInteractable: PushableComponent;
  #isPersistable: PersistableComponent<Properties>;

  constructor({ scene, properties: { id, color, x, y } }: Config) {
    const [textureKey, texture] = Balloon.getTexture(color);

    super({ scene, x, y, texture });

    this.id = id;

    this.#color = color;
    this.#isPersistable = new PersistableComponent<Properties>({
      host: this,
      toPersistenceProperties: () => ({
        id: this.id,
        x: this.x,
        y: this.y,
      }),
    });
    this.#isInteractable = new PushableComponent({
      host: this,
      baseDepth: Depth.Objects,
    });

    this.setBodySize(this.width - 8, this.height - 40);
    this.setOffset(6, 0);

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

  public get isInteractable(): PushableComponent {
    return this.#isInteractable;
  }

  public get isPersistable(): PersistableComponent<Properties> {
    return this.#isPersistable;
  }
}
