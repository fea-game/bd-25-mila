import { BaseCharacter } from "../../../../game-objects/characters/base-character";
import { StateMachine } from "../state-machine";
import { BaseCharacterState, CharacterState } from "./base-character-state";

export class IdleState extends BaseCharacterState {
  constructor(host: BaseCharacter, stateMachine: StateMachine) {
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
