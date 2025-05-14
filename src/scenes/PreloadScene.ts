import Phaser from "phaser";
import { SceneKey } from "./keys";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKey.Preload });
  }

  preload() {
    // Load assets here
  }

  create() {
    this.scene.start(SceneKey.Game);
  }
}
