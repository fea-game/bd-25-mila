import Phaser from "phaser";
import { SceneKey } from "../common/types";
import { AnimatedTextures } from "../common/assets";

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
    for (const anim of AnimatedTextures) {
      this.anims.createFromAseprite(anim);
    }
  }
}
