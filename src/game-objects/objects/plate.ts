import { Texture } from "../../common/assets";
import { BaseObject } from "./base-object";
import * as tiled from "../../tiled/types";
import { Actionable, ActionableComponent } from "../../components/game-object/object/actionable-component";
import { Persistable, PersistableComponent } from "../../components/game-object/common/persistable-component";

type Config = {
  scene: Phaser.Scene;
  properties: Pick<tiled.Plate, "x" | "y"> & tiled.Plate["properties"];
};

type Properties = {
  id: string;
  isWithCake: boolean;
};

export class Plate extends BaseObject<Properties> implements Actionable, Persistable<Properties> {
  private static getTexture(isWithCake: Config["properties"]["isWithCake"]): Texture {
    return isWithCake ? Texture.PlateWithCake : Texture.PlateWithoutCake;
  }

  public readonly id: string;

  #isWithCake: boolean;
  #isInteractable: ActionableComponent;
  #isPersistable: PersistableComponent<Properties>;

  constructor({ scene, properties: { id, x, y, isWithCake } }: Config) {
    super({ scene, x, y, texture: Plate.getTexture(isWithCake) });

    this.id = id;
    this.#isWithCake = isWithCake;

    this.#isInteractable = new ActionableComponent({
      host: this,
      interact: () => {},
      id,
      canBeInteractedWith: true,
    });

    this.#isPersistable = new PersistableComponent<Properties>({
      host: this,
      toPersistenceProperties: () => ({
        id: this.id,
        isWithCake: this.#isWithCake,
      }),
    });

    this.setImmovable(true);
  }

  get isInteractable(): ActionableComponent {
    return this.#isInteractable;
  }

  public get isPersistable(): PersistableComponent<Properties> {
    return this.#isPersistable;
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
