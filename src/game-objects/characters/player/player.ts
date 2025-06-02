import { AnimationType, Character, Texture } from "../../../common/assets";
import { CharacterState } from "../../../components/game-object/state-machine/character/base-character-state";
import { IdleState } from "../../../components/game-object/state-machine/character/idle-state";
import { MovingState } from "../../../components/game-object/state-machine/character/moving-state";
import { BaseCharacter, Config as CharacterGameObjectConfig } from "../base-character";
import * as tiled from "../../../tiled/types";
import { Actor, ActionComponent } from "../../../components/game-object/character/action-component";
import { Direction } from "../../../common/types";

export const PlayerType = "Mila";
export type PlayerType = typeof PlayerType;

type Config = Omit<CharacterGameObjectConfig, "id" | "animations" | "speed" | "texture" | "x" | "y"> & {
  properties: Pick<tiled.Player, "x" | "y"> & tiled.Player["properties"] & { direction?: Direction };
};

export class Player extends BaseCharacter<PlayerType> implements Actor {
  private static Animations: CharacterGameObjectConfig["animations"] = {
    character: Character[PlayerType],
    animations: [AnimationType.Idle, AnimationType.Walk],
  };

  #isActor: ActionComponent;

  public readonly characterType = "Mila";

  constructor({ properties: { id, x, y, direction }, ...config }: Config) {
    super({
      ...config,
      id,
      animations: Player.Animations,
      speed: 180,
      texture: Texture[PlayerType],
      x,
      y,
      direction,
    });

    this.#isActor = new ActionComponent(this);

    this.stateMachine.addState(new IdleState(this, this.stateMachine));
    this.stateMachine.addState(new MovingState(this, this.stateMachine));
    this.stateMachine.setState(CharacterState.Idle);

    config.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    config.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      config.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
    });
  }

  get isActor(): ActionComponent {
    return this.#isActor;
  }
}
