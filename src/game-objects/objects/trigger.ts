import { BaseObject } from "./base-object";
import * as tiled from "../../tiled/types";
import { Contactable, ContactableComponent } from "../../components/game-object/object/contactable-component";

type Config = {
  scene: Phaser.Scene;
  properties: Pick<tiled.Trigger, "x" | "y" | "width" | "height"> & tiled.Trigger["properties"];
};

export class Trigger extends BaseObject implements Contactable {
  public static readonly Id = {
    House: {
      HallwayLivingRoomTransition: "house-hallway-living-room-transition",
    },
  } as const;

  public readonly isPersistable = false;

  #isInteractable: ContactableComponent;

  constructor({ scene, properties: { id, x, y, width, height } }: Config) {
    super({ scene, x, y, texture: "transparent" });

    this.setDisplaySize(width, height);
    this.setVisible(false);

    this.#isInteractable = new ContactableComponent({
      id,
      host: this,
    });
  }

  public get isInteractable(): ContactableComponent {
    return this.#isInteractable;
  }
}
