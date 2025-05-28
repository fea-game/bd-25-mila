import { Depth } from "../../../../common/config";
import { Direction } from "../../../../common/types";
import { BaseCharacter } from "../../../../game-objects/characters/base-character";
import { NpcType } from "../../../../game-objects/characters/npc";
import { PlayerType } from "../../../../game-objects/characters/player/player";
import { GameStateManager } from "../../../../manager/game-state-manager";
import { StateMachine } from "../state-machine";
import { BaseCharacterState, CharacterState } from "./base-character-state";

export class MovingState extends BaseCharacterState {
  private static getDepth(y: number, baseDepth: number = Depth.Character): number {
    return baseDepth + y / 10000;
  }

  constructor(host: BaseCharacter<PlayerType | NpcType>, stateMachine: StateMachine) {
    super(CharacterState.Moving, host, stateMachine);

    this.host.setDepth(MovingState.getDepth(this.host.y));
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
    this.host.setDepth(MovingState.getDepth(this.host.y));

    GameStateManager.instance.character[this.host.characterType] = { x: this.host.x, y: this.host.y };
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
