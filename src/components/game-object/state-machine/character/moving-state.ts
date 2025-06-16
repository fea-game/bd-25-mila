import { Depth } from "../../../../common/config";
import { Direction } from "../../../../common/types";
import { getDepth } from "../../../../common/utils";
import { BaseCharacter } from "../../../../game-objects/characters/base-character";
import { NpcType } from "../../../../game-objects/characters/npc";
import { PlayerType } from "../../../../game-objects/characters/player";
import { GameStateManager } from "../../../../manager/game-state-manager";
import { StateMachine } from "../state-machine";
import { BaseCharacterState, CharacterState } from "./base-character-state";

export class MovingState extends BaseCharacterState {
  constructor(host: BaseCharacter<PlayerType | NpcType>, stateMachine: StateMachine) {
    super(CharacterState.Moving, host, stateMachine);
  }

  public onUpdate(): void {
    const controls = this.host.controls;

    if (this.host.controls.isNoMovement) {
      this.stateMachine.setState(CharacterState.Idle);

      return;
    }

    this.handleCharacterMovement();
  }

  private handleCharacterMovement(): void {
    const controls = this.host.controls;

    if (controls.isUpDown) {
      this.updateVelocity(false, -1);
      this.updateDirection(Direction.Up);
    } else if (controls.isDownDown) {
      this.updateVelocity(false, 1);
      this.updateDirection(Direction.Down);
    } else {
      this.updateVelocity(false, 0);
    }

    const isMovingVertically = controls.isDownDown || controls.isUpDown;
    if (controls.isLeftDown) {
      this.updateVelocity(true, -1);
      if (!isMovingVertically) {
        this.updateDirection(Direction.Left);
      }
    } else if (controls.isRightDown) {
      this.updateVelocity(true, 1);
      if (!isMovingVertically) {
        this.updateDirection(Direction.Right);
      }
    } else {
      this.updateVelocity(true, 0);
    }

    this.normalizeVelocity();
    this.host.setDepth(getDepth(this.host.y, Depth.Character));

    const persistenceProperties = this.host.isPersistable.toPersistenceProperties();
    GameStateManager.instance.character[persistenceProperties.id] = persistenceProperties;
  }

  private updateVelocity(isX: boolean, value: number) {
    if (isX) {
      this.host.body.velocity.x = value;
      return;
    }

    this.host.body.velocity.y = value;
  }

  private normalizeVelocity(): void {
    this.host.body.velocity.normalize().scale(this.host.speed);
  }

  private updateDirection(direction: Direction): void {
    this.host.direction = direction;
    this.host.animation.play(`walk-${direction}`);
  }
}
