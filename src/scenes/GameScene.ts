import Phaser from "phaser";
import { SceneKey } from "./keys";

export default class GameScene extends Phaser.Scene {
  character: Phaser.Physics.Arcade.Sprite;

  constructor() {
    super({ key: SceneKey.Game });
  }

  create() {
    this.character = this.physics.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, "characters");
    this.character.play("walk-down"); // Start with walking down animation

    this.time.addEvent({
      delay: 3000,
      callback: this.changeAnimation,
      callbackScope: this,
      loop: true
    });
  }

  changeAnimation() {
    const animations = ["walk-down", "walk-left", "walk-right", "walk-up"];
    const currentAnimation = this.character.anims.currentAnim;
    if (currentAnimation) {
      const nextAnimation = animations[(animations.indexOf(currentAnimation.key) + 1) % animations.length];
      this.character.play(nextAnimation);
    }
  }
}
