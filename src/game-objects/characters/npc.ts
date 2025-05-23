import { Character, AnimationType, Texture } from "../../common/assets";
import { Depth } from "../../common/config";
import { CharacterState } from "../../components/game-object/state-machine/character/base-character-state";
import { IdleState } from "../../components/game-object/state-machine/character/idle-state";
import { MovingState } from "../../components/game-object/state-machine/character/moving-state";
import { BaseCharacter, Config as CharacterGameObjectConfig } from "./base-character";
import * as tiled from "../../tiled/types";
import { Direction } from "../../common/types";

type NpcType = tiled.NPC["properties"]["type"];

type Config = Omit<CharacterGameObjectConfig, "animations" | "speed" | "texture" | "x" | "y"> & {
  properties: Pick<tiled.NPC, "x" | "y" | "properties">;
};

export class Npc extends BaseCharacter {
  private static getAnimations(npcKey: NpcType): CharacterGameObjectConfig["animations"] {
    return {
      character: Character[npcKey],
      animations: [AnimationType.Idle, AnimationType.Walk],
    };
  }

  private static getControlsProperty(direction: Direction) {
    switch (direction) {
      case Direction.Down:
        return "isDownDown";
      case Direction.Left:
        return "isLeftDown";
      case Direction.Right:
        return "isRightDown";
      case Direction.Up:
      default:
        return "isUpDown";
    }
  }

  private static getCoordinates(move: Move, start: { x: number; y: number }) {
    switch (move.direction) {
      case Direction.Down:
        return { property: "y", start: start.y, target: start.y + move.distance };
      case Direction.Left:
        return { property: "x", start: start.x, target: start.x - move.distance };
      case Direction.Right:
        return { property: "x", start: start.x, target: start.x + move.distance };
      case Direction.Up:
      default:
        return { property: "y", start: start.y, target: start.y - move.distance };
    }
  }

  public readonly isActor = false;
  public readonly isInteractable = false;
  public readonly isPushable = false;

  #npcType: NpcType;

  constructor({ properties: { x, y, properties }, ...config }: Config) {
    super({
      ...config,
      id: Character[properties.type],
      animations: Npc.getAnimations(properties.type),
      speed: 180,
      texture: Texture[properties.type],
      x: x,
      y: y,
    });

    this.#npcType = properties.type;

    this.stateMachine.addState(new IdleState(this, this.stateMachine));
    this.stateMachine.addState(new MovingState(this, this.stateMachine));
    this.stateMachine.setState(CharacterState.Idle);

    config.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    config.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      config.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
    });

    if (properties.type === "Amelie") {
      this.scene.time.delayedCall(2000, () => {
        this.move([
          { direction: Direction.Left, distance: 170 },
          { direction: Direction.Down, distance: 200 },
          { direction: Direction.Right, distance: 20 },
        ]);
      });
    }
  }

  public get npcType(): NpcType {
    return this.#npcType;
  }

  public turn(direction: Direction, onFinished?: () => void): void {
    this.direction = direction;
    onFinished?.();
  }

  public move(by: Move[], onFinished?: () => void): void {
    if (by.length === 0) return;

    const generator = this.createMovesGenerator(by);

    const step = () => {
      const result = generator.next();

      if (result.done) {
        onFinished?.();
        return;
      }

      this.moveBy(result.value, step);
    };

    step();
  }

  private moveBy(move: Move, onFinished: () => void) {
    const controlsProperty = Npc.getControlsProperty(move.direction);
    const { property: coordProperty, start, target } = Npc.getCoordinates(move, this);

    this.controls[controlsProperty] = true;

    const checkTimer = this.scene.time.addEvent({
      delay: 16, // check every frame (~60fps)
      loop: true,
      callback: () => {
        const distance = target - this[coordProperty];

        if (distance >= -1 && distance <= 1) {
          this.controls[controlsProperty] = false;
          this.scene.time.removeEvent(checkTimer);

          onFinished();
        }
      },
    });
  }

  private *createMovesGenerator(moves: Move[]): Generator<Move, void, unknown> {
    for (const move of moves) {
      yield move;
    }
  }
}

type Move = { direction: Direction; distance: number };
