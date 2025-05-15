import { CharacterAnimation } from "../../../common/animations";
import { CharacterState } from "../../../components/state-machine/character/base-character-state";
import { IdleState } from "../../../components/state-machine/character/idle-state";
import { MovingState } from "../../../components/state-machine/character/moving-state";
import {
  CharacterGameObject,
  Config as CharacterGameObjectConfig,
} from "../character-game-object";

type Config = Omit<CharacterGameObjectConfig, "animations" | "speed">;

export class Player extends CharacterGameObject {
  private static animations: CharacterGameObjectConfig["animations"] = {
    [CharacterAnimation.IdleDown]: {
      key: "player-idle-down",
      repeat: -1,
      ignoreIfPlaying: true,
    },
    [CharacterAnimation.IdleLeft]: {
      key: "player-idle-left",
      repeat: -1,
      ignoreIfPlaying: true,
    },
    [CharacterAnimation.IdleRight]: {
      key: "player-idle-right",
      repeat: -1,
      ignoreIfPlaying: true,
    },
    [CharacterAnimation.IdleUp]: {
      key: "player-idle-up",
      repeat: -1,
      ignoreIfPlaying: true,
    },
    [CharacterAnimation.WalkDown]: {
      key: "player-walk-down",
      repeat: -1,
      ignoreIfPlaying: true,
    },
    [CharacterAnimation.WalkLeft]: {
      key: "player-walk-left",
      repeat: -1,
      ignoreIfPlaying: true,
    },
    [CharacterAnimation.WalkRight]: {
      key: "player-walk-right",
      repeat: -1,
      ignoreIfPlaying: true,
    },
    [CharacterAnimation.WalkUp]: {
      key: "player-walk-up",
      repeat: -1,
      ignoreIfPlaying: true,
    },
  };

  constructor(config: Config) {
    super({
      ...config,
      id: "player",
      animations: Player.animations,
      speed: 160,
    });

    this.stateMachine.addState(new IdleState(this, this.stateMachine));
    this.stateMachine.addState(new MovingState(this, this.stateMachine));
    this.stateMachine.setState(CharacterState.Idle);

    config.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    config.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      config.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
    });
  }
}
