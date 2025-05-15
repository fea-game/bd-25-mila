import { CharacterGameObject } from "../../../game-objects/characters/character-game-object";
import { StateMachine } from "../state-machine";
import { BaseCharacterState, CharacterState } from "./base-character-state";

export class IdleState extends BaseCharacterState {
  constructor(host: CharacterGameObject, stateMachine: StateMachine) {
    super(CharacterState.Idle, host, stateMachine);
  }

  public onEnter(): void {
    this.host.animation.play(`idle-${this.host.direction}`);
    this.resetVelocity();
  }

  public onUpdate(): void {
    if (this.host.controls.isNoMovement) return;

    this.stateMachine.setState(CharacterState.Moving);
  }
}
