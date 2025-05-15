import Phaser from "phaser";
import { SceneKey } from "../common/types";
import { KeyboardComponent } from "../components/input/keyboard-component";
import { Player } from "../game-objects/characters/player/player";

export default class GameScene extends Phaser.Scene {
  private keyboard: KeyboardComponent;
  private player: Player;

  constructor() {
    super({ key: SceneKey.Game });
  }

  create() {
    if (!this.input.keyboard) {
      console.warn("Phaser keyboard plugin not enabled");
      return;
    }

    this.keyboard = new KeyboardComponent(this.input.keyboard);

    this.player = new Player({
      scene: this,
      x: this.cameras.main.width / 2,
      y: this.cameras.main.height / 2,
      texture: "character",
      input: this.keyboard,
    });
  }
}
