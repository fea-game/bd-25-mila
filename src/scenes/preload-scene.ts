import Phaser from "phaser";
import { SceneKey } from "../common/types";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKey.Preload });
  }

  preload() {
    this.load.pack("main", "assets/data/assets.json");
  }

  create() {
    this.createAnimations();

    this.scene.start(SceneKey.Game);
  }

  private createAnimations() {
    this.anims.createFromAseprite("character");
  }
}
