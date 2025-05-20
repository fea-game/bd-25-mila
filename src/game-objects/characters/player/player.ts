import { AnimationType, Character, Texture } from "../../../common/assets";
import { Depth } from "../../../common/config";
import { CharacterState } from "../../../components/game-object/state-machine/character/base-character-state";
import { IdleState } from "../../../components/game-object/state-machine/character/idle-state";
import { MovingState } from "../../../components/game-object/state-machine/character/moving-state";
import { BaseCharacter, Config as CharacterGameObjectConfig } from "../base-character";
import * as tiled from "../../../tiled/types";

type Config = Omit<CharacterGameObjectConfig, "animations" | "speed" | "texture" | "x" | "y"> & {
  properties: Pick<tiled.Player, "x" | "y">;
};

export class Player extends BaseCharacter {
  private static Animations: CharacterGameObjectConfig["animations"] = {
    character: Character.Player,
    animations: [AnimationType.Idle, AnimationType.Walk],
  };

  private static ShortenBodyBy = 0;

  constructor({ properties, ...config }: Config) {
    super({
      ...config,
      id: "player",
      animations: Player.Animations,
      speed: 180,
      texture: Texture.Player,
      x: properties.x,
      y: properties.y - Player.ShortenBodyBy,
    });

    this.stateMachine.addState(new IdleState(this, this.stateMachine));
    this.stateMachine.addState(new MovingState(this, this.stateMachine));
    this.stateMachine.setState(CharacterState.Idle);

    this.setDepth(Depth.Player)
      .setBodySize(48, this.height - Player.ShortenBodyBy)
      .setOffset(0, Player.ShortenBodyBy);

    config.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    config.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      config.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
    });
  }
}
