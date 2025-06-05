import { Texture } from "../../common/assets";
import { BaseObject } from "./base-object";
import * as tiled from "../../tiled/types";
import { Actionable, ActionableComponent } from "../../components/game-object/object/actionable-component";
import { Persistable, PersistableComponent } from "../../components/game-object/common/persistable-component";
import { GameStateManager } from "../../manager/game-state-manager";

type Config = {
  scene: Phaser.Scene;
  properties: Pick<tiled.Toilet, "x" | "y"> & tiled.Toilet["properties"];
};

type Properties = {
  id: string;
  isOpened: boolean;
};

export class Toilet extends BaseObject<Properties> implements Actionable, Persistable<Properties> {
  private static getTexture(isOpened: boolean): Texture {
    return Texture[`Toilet${isOpened ? "Opened" : "Closed"}`];
  }

  private static ShortenBodyBy = 54;

  public readonly id: string;

  #isInteractable: ActionableComponent;
  #isPersistable: PersistableComponent<Properties>;
  #isOpened: boolean;

  constructor({ scene, properties: { id, x, y, isOpened } }: Config) {
    super({ scene, x, y, texture: Toilet.getTexture(isOpened) });

    this.id = id;
    this.#isOpened = isOpened;

    this.setBodySize(this.displayWidth, this.displayHeight - Toilet.ShortenBodyBy).setOffset(0, Toilet.ShortenBodyBy);
    this.setImmovable(true);
    this.setPushable(false);

    this.#isPersistable = new PersistableComponent<Properties>({
      host: this,
      toPersistenceProperties: () => ({
        id: this.id,
        isOpened: this.#isOpened,
      }),
    });

    this.#isInteractable = new ActionableComponent({
      host: this,
      interact: () => {
        this.isOpened = !this.#isOpened;
      },
    });
  }

  get isInteractable(): ActionableComponent {
    return this.#isInteractable;
  }

  public get isPersistable(): PersistableComponent<Properties> {
    return this.#isPersistable;
  }

  public get isOpened(): boolean {
    return this.#isOpened;
  }
  public set isOpened(isOpened: boolean) {
    if (isOpened === this.#isOpened) return;

    this.#isOpened = isOpened;

    this.setTexture(Toilet.getTexture(isOpened));

    GameStateManager.instance[GameStateManager.instance.area].objects[this.id] =
      this.#isPersistable.toPersistenceProperties();
  }
}
