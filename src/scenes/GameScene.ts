import Phaser from "phaser";
import { SceneKey } from "../common/constants";

const animations = ["walk-down", "walk-left", "walk-right", "walk-up"];

export default class GameScene extends Phaser.Scene {
  character: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor() {
    super({ key: SceneKey.Game });
  }

  create() {
    this.character = this.physics.add
      .sprite(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2,
        "character"
      )
      .play(animations[0]);

    this.time.addEvent({
      delay: 3000,
      callback: this.changeAnimation,
      callbackScope: this,
      loop: true,
    });
  }

  changeAnimation() {
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
