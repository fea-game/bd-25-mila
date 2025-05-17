import { AnimationType, Character, Texture } from "../../../common/assets";
import { Depth } from "../../../common/config";
import { CharacterState } from "../../../components/game-object/state-machine/character/base-character-state";
import { IdleState } from "../../../components/game-object/state-machine/character/idle-state";
import { MovingState } from "../../../components/game-object/state-machine/character/moving-state";
import { BaseCharacter, Config as CharacterGameObjectConfig } from "../base-character";

type Config = Omit<CharacterGameObjectConfig, "animations" | "speed" | "texture">;

export class Player extends BaseCharacter {
  private static Animations: CharacterGameObjectConfig["animations"] = {
    character: Character.Player,
    animations: [AnimationType.Idle, AnimationType.Walk],
  };

  constructor(config: Config) {
    super({
      ...config,
      id: "player",
      animations: Player.Animations,
      speed: 180,
      texture: Texture.Player,
    });

    this.stateMachine.addState(new IdleState(this, this.stateMachine));
    this.stateMachine.addState(new MovingState(this, this.stateMachine));
    this.stateMachine.setState(CharacterState.Idle);

    this.setDepth(Depth.Player).setBodySize(48, 24).setOffset(0, 48);

    config.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    config.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      config.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
    });
  }
}
