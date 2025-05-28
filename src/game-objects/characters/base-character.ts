import Phaser from "phaser";
import {
  CharacterAnimationComponent,
  Config as CharacterAnimationComponentConfig,
} from "../../components/game-object/character/animation-component";
import { StateMachine } from "../../components/game-object/state-machine/state-machine";
import { ControlsComponent } from "../../components/game-object/character/controls-component";
import { InputComponent } from "../../components/input/input-component";
import { DirectionComponent } from "../../components/game-object/character/direction-component";
import { SpeedComponent } from "../../components/game-object/character/speed-component";
import { Body, Direction, GameObject } from "../../common/types";
import { ActionComponent, isActor } from "../../components/game-object/character/action-component";
import { Depth } from "../../common/config";
import { NpcType } from "./npc";
import { PlayerType } from "./player/player";

export type Config = {
  animations: CharacterAnimationComponentConfig;
  frame?: string | number;
  id?: string;
  input: InputComponent;
  onDirectionChange?: (direction: Direction) => void;
  scene: Phaser.Scene;
  speed: number;
  texture: string;
  x: number;
  y: number;
};

export abstract class BaseCharacter<T extends NpcType | PlayerType> extends GameObject {
  protected static ShortenBodyBy = 48;

  declare body: Body;

  private animationComponent: CharacterAnimationComponent;
  private controlsComponent: ControlsComponent;
  private directionComponent: DirectionComponent;
  private speedComponent: SpeedComponent;
  protected stateMachine: StateMachine;

  public abstract isActor: false | ActionComponent;
  public abstract characterType: T;

  constructor(config: Config) {
    const { animations, frame, id, input, onDirectionChange, scene, speed, texture, x, y } = config;

    super(scene, x, y, texture, frame);

    this.animationComponent = new CharacterAnimationComponent(this, animations);
    this.controlsComponent = new ControlsComponent(this, input);
    this.directionComponent = new DirectionComponent(this, onDirectionChange);
    this.speedComponent = new SpeedComponent(this, speed);
    this.stateMachine = new StateMachine(id);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setBodySize(this.width, this.height - BaseCharacter.ShortenBodyBy);
    this.setDepth(Depth.Character);
    this.setPushable(false);
    this.setOffset(0, BaseCharacter.ShortenBodyBy);
    this.setOrigin(0, 1);
  }

  get animation(): CharacterAnimationComponent {
    return this.animationComponent;
  }

  get controls(): InputComponent {
    return this.controlsComponent.input;
  }

  get direction(): Direction {
    return this.directionComponent.direction;
  }
  set direction(direction: Direction) {
    this.directionComponent.direction = direction;
  }

  get speed(): number {
    return this.speedComponent.speed;
  }

  public update(): void {
    this.stateMachine.update();
    this.maybeAct();
  }

  private maybeAct() {
    if (!this.controls.isActionKeyJustDown) return;
    if (!isActor(this)) return false;

    const focused = this.isActor.focused;
    if (!focused?.isInteractable.canBeInteractedWith) return;

    focused.isInteractable.interact(this);
  }
}
