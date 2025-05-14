import Phaser from "phaser";
import { SceneKey } from "../common/constants";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKey.Preload });
  }

  preload() {
    this.load.animation(
      "characterAnimations",
      "assets/images/characters/character.animations.json"
    );
    this.load.atlas(
      "character",
      "assets/images/characters/character.png",
      "assets/images/characters/character.atlas.json"
    );
  }

  create() {
    this.scene.start(SceneKey.Game);
  }
}
