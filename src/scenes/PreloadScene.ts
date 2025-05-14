import Phaser from "phaser";
import { SceneKey } from "./keys";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKey.Preload });
  }

  preload() {
    this.load.spritesheet("characters", "assets/images/characters/New_Characters 48x48.png", {
      frameWidth: 48,
      frameHeight: 96
    });
  }

  create() {
    this.anims.create({
      key: "walk-down",
      frames: this.anims.generateFrameNumbers("characters", { frames: [1, 0, 1, 2] }),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: "walk-left",
      frames: this.anims.generateFrameNumbers("characters", { frames: [13, 12, 13, 14] }),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: "walk-right",
      frames: this.anims.generateFrameNumbers("characters", { frames: [25, 24, 25, 26] }),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: "walk-up",
      frames: this.anims.generateFrameNumbers("characters", { frames: [37, 36, 37, 38] }),
      frameRate: 6,
      repeat: -1
    });
    this.scene.start(SceneKey.Game);
  }
}
