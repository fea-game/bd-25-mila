import * as Phaser from "phaser";
import { Direction, GameObject } from "../../../common/types";
import { BaseGameObjectComponent } from "../base-game-object-component";
import { AnimationType, Character, getCharacterAnimation } from "../../../common/assets";

type AnimationConfig = {
  repeat: number;
  ignoreIfPlaying: boolean;
};

type ConfiguredAnimation = { type: AnimationType; config: AnimationConfig };

type AnimationParameter = AnimationType | ConfiguredAnimation;

type CharacterAnimation = `${AnimationType}-${Direction}`;

type Animations = {
  [key in CharacterAnimation]?: {
    key: string;
    repeat: number;
    ignoreIfPlaying: boolean;
  };
};

export type Config = {
  character: Character;
  animations: Array<AnimationParameter>;
};

export class CharacterAnimationComponent extends BaseGameObjectComponent {
  private static normalise(animation: AnimationParameter): ConfiguredAnimation {
    if (typeof animation === "object" && "config" in animation) {
      return animation;
    }

    return { type: animation, config: { repeat: -1, ignoreIfPlaying: true } };
  }

  private static toConfig(character: Character, animations: Array<AnimationParameter>): Animations {
    const config: Animations = {};
    const directions: Direction[] = Object.values(Direction);

    for (const animation of animations) {
      const { type, config: animationConfig } = CharacterAnimationComponent.normalise(animation);

      for (const direction of directions) {
        config[`${type}-${direction}`] = {
          ...animationConfig,
          key: getCharacterAnimation(character, type, direction),
        };
      }
    }

    return config;
  }

  private config: Animations;

  constructor(host: GameObject, config: Config) {
    super(host);

    this.config = CharacterAnimationComponent.toConfig(config.character, config.animations);
  }

  public isPlaying(): boolean {
    return this.host.anims.isPlaying;
  }

  public getKey(characterAnimationKey: CharacterAnimation): string | undefined {
    return this.config[characterAnimationKey]?.key;
  }

  public play(characterAnimationKey: CharacterAnimation, onFinished?: () => void): void {
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
      const animationKey = Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + animation.key;
      this.host.once(animationKey, onFinished);
    }

    this.host.play(animationConfig, animation.ignoreIfPlaying);
  }

  public playInRevers(characterAnimationKey: CharacterAnimation, onFinished?: () => void): void {
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
      const animationKey = Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + animation.key;
      this.host.once(animationKey, onFinished);
    }

    this.host.playReverse(animationConfig, animation.ignoreIfPlaying);
  }
}
