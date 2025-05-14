import Phaser from "phaser";
import { SceneKey } from "../common/constants";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKey.Preload });
  }

  preload() {
    this.load.animation(
      "characterAnimations",
      "assets/images/characters/New_Characters_48x48.animations.json"
    );
    this.load.atlas(
      "character",
      "assets/images/characters/New_Characters_48x48.png",
      "assets/images/characters/New_Characters_48x48.atlas.json"
    );
  }

  create() {
    this.scene.start(SceneKey.Game);
  }
}
