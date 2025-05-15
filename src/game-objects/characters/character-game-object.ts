import Phaser from "phaser";
import {
  CharacterAnimationComponent,
  Config as CharacterAnimationComponentConfig,
} from "../../components/game-object/animation-component";

export type Config = {
  animations: CharacterAnimationComponentConfig;
  frame?: string | number;
  scene: Phaser.Scene;
  texture: string;
  x: number;
  y: number;
};

export abstract class CharacterGameObject extends Phaser.Physics.Arcade.Sprite {
  private animationComponent: CharacterAnimationComponent;

  constructor(config: Config) {
    const { animations, frame, scene, texture, x, y } = config;

    super(scene, x, y, texture, frame);

    this.animationComponent = new CharacterAnimationComponent(this, animations);

    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  get animation(): CharacterAnimationComponent {
    return this.animationComponent;
  }
}
