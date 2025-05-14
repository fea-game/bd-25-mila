import Phaser from "phaser";
import { SceneKey } from "./keys";

export default class GameScene extends Phaser.Scene {
  character: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor() {
    super({ key: SceneKey.Game });
  }

  create() {
    this.character = this.physics.add
      .sprite(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "characters"
      )
      .setSize(48, 72)
      .setOffset(0, 24)
      .play("walk-down");

    this.time.addEvent({
      delay: 3000,
      callback: this.changeAnimation,
      callbackScope: this,
      loop: true,
    });
  }

  changeAnimation() {
    const animations = ["walk-down", "walk-left", "walk-right", "walk-up"];
    const currentAnimation = this.character.anims.currentAnim;
    if (currentAnimation) {
      const nextAnimation =
        animations[
          (animations.indexOf(currentAnimation.key) + 1) % animations.length
        ];
      this.character.play(nextAnimation);
    }
  }
}
