import Phaser from "phaser";
import { SceneKey } from "../common/types";
import { Player } from "../game-objects/characters/player/player";
import { CharacterAnimation } from "../common/animations";

const animations: Array<CharacterAnimation> = [
  "IDLE_DOWN",
  "IDLE_LEFT",
  "IDLE_UP",
  "IDLE_RIGHT",
  "WALK_DOWN",
  "WALK_LEFT",
  "WALK_UP",
  "WALK_RIGHT",
];
let animIndex = 0;

export default class GameScene extends Phaser.Scene {
  character: Player;

  constructor() {
    super({ key: SceneKey.Game });
  }

  create() {
    this.character = new Player({
      scene: this,
      x: this.cameras.main.width / 2,
      y: this.cameras.main.height / 2,
      texture: "character",
    });
    this.character.animation.play(animations[animIndex]);

    this.time.addEvent({
      delay: 3000,
      callback: this.changeAnimation,
      callbackScope: this,
      loop: true,
    });
  }

  changeAnimation() {
    animIndex += 1;
    const nextAnimation = animations[animIndex % animations.length];
    this.character.animation.play(nextAnimation);
  }
}
