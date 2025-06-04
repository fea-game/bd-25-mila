import { Character, AnimationType, Texture } from "../../common/assets";
import { CharacterState } from "../../components/game-object/state-machine/character/base-character-state";
import { IdleState } from "../../components/game-object/state-machine/character/idle-state";
import { MovingState } from "../../components/game-object/state-machine/character/moving-state";
import { BaseCharacter, Config as CharacterGameObjectConfig } from "./base-character";
import * as tiled from "../../tiled/types";
import { Direction, GameObject } from "../../common/types";
import { GameStateManager } from "../../manager/game-state-manager";
import { Actionable, ActionableComponent } from "../../components/game-object/object/actionable-component";
import { Actor } from "../../components/game-object/character/action-component";

export type NpcType = Exclude<tiled.NPC["properties"]["type"], "Dog" | "Neighbor" | "Thief">;

type Config = Omit<CharacterGameObjectConfig, "id" | "animations" | "speed" | "texture" | "x" | "y"> & {
  properties: Pick<tiled.NPC, "x" | "y"> & tiled.NPC["properties"] & { direction?: Direction };
};

export class Npc extends BaseCharacter<NpcType> implements Actionable {
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

  #npcType: NpcType;
  #isInteractable: ActionableComponent;

  constructor({ properties: { id, type, x, y, direction }, ...config }: Config) {
    if (type === "Dog" || type === "Neighbor" || type === "Thief") {
      throw new Error(`${type} NPC isn't supported yet!`);
    }

    super({
      ...config,
      id,
      animations: Npc.getAnimations(type),
      speed: 180,
      texture: Texture[type],
      x,
      y,
      direction,
    });

    this.#npcType = type;

    this.#isInteractable = new ActionableComponent({
      host: this,
      interact: (actor: GameObject & Actor) => {
        this.turn(this.directionComponent.getDirectionTo(actor));
      },
      id,
      canBeInteractedWith: false,
    });

    this.stateMachine.addState(new IdleState(this, this.stateMachine));
    this.stateMachine.addState(new MovingState(this, this.stateMachine));
    this.stateMachine.setState(CharacterState.Idle);

    config.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    config.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      config.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
    });
  }

  public get characterType(): NpcType {
    return this.#npcType;
  }

  get isInteractable(): ActionableComponent {
    return this.#isInteractable;
  }

  public turn(direction: Direction, onFinished?: () => void): void {
    this.direction = direction;

    const persistenceProperties = this.isPersistable.toPersistenceProperties();
    GameStateManager.instance.character[persistenceProperties.id] = persistenceProperties;

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
    const isDistancePositive = target > start;

    this.controls[controlsProperty] = true;

    const checkTimer = this.scene.time.addEvent({
      delay: 16, // check every frame (~60fps)
      loop: true,
      callback: () => {
        const current = this[coordProperty];
        const isArrived = isDistancePositive ? current >= target : current <= target;

        if (isArrived) {
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
