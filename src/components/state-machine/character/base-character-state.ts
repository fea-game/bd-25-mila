import { CharacterGameObject } from "../../../game-objects/characters/character-game-object";
import { State, StateMachine } from "../state-machine";

export const CharacterState = {
  Idle: "idle",
  Moving: "moving",
} as const;

export type CharacterState =
  (typeof CharacterState)[keyof typeof CharacterState];

export abstract class BaseCharacterState implements State {
  public readonly name: CharacterState;
  protected host: CharacterGameObject;
  protected stateMachine: StateMachine;

  constructor(
    name: CharacterState,
    host: CharacterGameObject,
    stateMachine: StateMachine
  ) {
    this.name = name;
    this.host = host;
    this.stateMachine = stateMachine;
  }

  protected resetVelocity(): void {
    this.host.body.velocity.x = 0;
    this.host.body.velocity.y = 0;
  }
}
