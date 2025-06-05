import { Texture } from "../../common/assets";
import { BaseObject } from "./base-object";
import * as tiled from "../../tiled/types";
import { Persistable, PersistableComponent } from "../../components/game-object/common/persistable-component";
import { GameStateManager } from "../../manager/game-state-manager";
import { Contactable, ContactableComponent } from "../../components/game-object/object/contactable-component";
import { Depth } from "../../common/config";

type Config = {
  scene: Phaser.Scene;
  properties: Pick<tiled.Crumbs, "x" | "y"> &
    tiled.Crumbs["properties"] & { isRevealed?: boolean; canBeInteractedWith?: boolean };
};

type CrumbsType = tiled.CrumbsType;

type Properties = {
  id: string;
  isRevealed: boolean;
  canBeInteractedWith: boolean;
};

export class Crumbs extends BaseObject<Properties> implements Contactable, Persistable<Properties> {
  private static getTexture(type: CrumbsType): Texture {
    return Texture[`Crumbs${type}`];
  }

  public readonly id: string;
  public readonly crumbsType: CrumbsType;

  #isInteractable: ContactableComponent;
  #isPersistable: PersistableComponent<Properties>;
  #isRevealed: boolean;

  constructor({ scene, properties: { id, x, y, type, isRevealed = false, canBeInteractedWith = false } }: Config) {
    super({ scene, x, y, texture: Crumbs.getTexture(type) });

    this.id = id;
    this.crumbsType = type;
    this.#isRevealed = isRevealed;

    this.setDepth(Depth.Trigger);
    this.setImmovable(true);
    this.setPushable(false);

    this.#isPersistable = new PersistableComponent<Properties>({
      host: this,
      toPersistenceProperties: () => ({
        id: this.id,
        isRevealed: this.#isRevealed,
        canBeInteractedWith: this.#isInteractable.canBeInteractedWith,
      }),
    });

    this.#isInteractable = new ContactableComponent({
      id,
      host: this,
      canBeInteractedWith,
    });

    if (!this.#isRevealed) {
      this.setVisible(false);
    }
  }

  get isInteractable(): ContactableComponent {
    return this.#isInteractable;
  }

  public get isPersistable(): PersistableComponent<Properties> {
    return this.#isPersistable;
  }

  public get isRevealed(): boolean {
    return this.#isRevealed;
  }
  public set isRevealed(value: boolean) {
    if (value === this.#isRevealed) return;

    this.#isRevealed = value;
    this.setVisible(this.#isRevealed);

    GameStateManager.instance[GameStateManager.instance.area].objects[this.id] =
      this.#isPersistable.toPersistenceProperties();
  }
}
