import * as Phaser from "phaser";
import { GameObject } from "../../common/types";
import { BaseGameObjectComponent } from "./base-game-object-component";
import { CharacterAnimation } from "../../common/animations";

export type Config = {
  [key in CharacterAnimation]?: {
    key: string;
    repeat: number;
    ignoreIfPlaying: boolean;
  };
};

export class CharacterAnimationComponent extends BaseGameObjectComponent {
  private config: Config;

  constructor(gameObject: GameObject, config: Config) {
    super(gameObject);
    this.config = config;
  }

  public isPlaying(): boolean {
    return this.host.anims.isPlaying;
  }

  public getKey(characterAnimationKey: CharacterAnimation): string | undefined {
    return this.config[characterAnimationKey]?.key;
  }

  public play(
    characterAnimationKey: CharacterAnimation,
    onFinished?: () => void
  ): void {
    const animation = this.config[characterAnimationKey];

    if (!animation) {
      onFinished?.();
      return;
    }

    const animationConfig: Phaser.Types.Animations.PlayAnimationConfig = {
      key: animation.key,
      repeat: animation.repeat,
      timeScale: 1,
    };

    if (onFinished) {
      const animationKey =
        Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + animation.key;
      this.host.once(animationKey, onFinished);
    }

    this.host.play(animationConfig, animation.ignoreIfPlaying);
  }

  public playInRevers(
    characterAnimationKey: CharacterAnimation,
    onFinished?: () => void
  ): void {
    const animation = this.config[characterAnimationKey];

    if (!animation) {
      onFinished?.();
      return;
    }

    const animationConfig: Phaser.Types.Animations.PlayAnimationConfig = {
      key: animation.key,
      repeat: animation.repeat,
      timeScale: 1.75,
    };

    if (onFinished) {
      const animationKey =
        Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + animation.key;
      this.host.once(animationKey, onFinished);
    }

    this.host.playReverse(animationConfig, animation.ignoreIfPlaying);
  }
}
