import Phaser from "phaser";
import { SceneKey } from "../common/types";
import { Animation } from "../common/assets";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKey.Preload });
  }

  preload() {
    this.load.pack("main", "assets/data/assets.json");
    for (const [key, { url }] of Object.entries(Animation)) {
      this.load.animation(key, url);
    }
  }

  create() {
    this.scene.start(SceneKey.Game);
  }
}
