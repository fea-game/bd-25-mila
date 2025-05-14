import Phaser from "phaser";
import { SceneKey } from "./keys";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKey.Game });
  }

  create() {
    const text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Hello, Phaser!", {
      fontSize: "16px",
      color: "#ffffff"
    });
    text.setOrigin(0.5, 0.5); // Center the text
  }
}
