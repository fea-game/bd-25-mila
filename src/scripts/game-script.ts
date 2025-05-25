import Phaser from "phaser";
import { Area, InteractionType } from "../common/types";
import { Player } from "../game-objects/characters/player/player";
import GameScene from "../scenes/game-scene";

export abstract class GameScript<
  I extends string = string,
  S extends Record<I, Scene<unknown>> = Record<I, Scene<unknown>>
> {
  protected scenes: S;
  protected _state: State;

  public constructor(public readonly host: GameScene, public readonly objects: Objects, scenes: S, firstSceneId: I) {
    this.scenes = scenes;

    this._state = {
      currentScene: this.scenes[firstSceneId],
      finishedScenes: [],
    };

    if (!this.state.currentScene) {
      throw new Error(`Invalid scene "${firstSceneId}" provided! Must be one of ${Object.keys(this.scenes)}.`);
    }

    this.startCurrentScene();
  }

  public get state(): State {
    return this._state;
  }

  public update(time: number, delta: number): void {
    if (this._state.currentScene.isFinished()) {
      const finishedScene = this._state.currentScene;
      this._state.finishedScenes.push(finishedScene);
      this._state.currentScene = this.next(finishedScene);

      this.startCurrentScene();
    }
  }

  protected startCurrentScene(): void {
    switch (this._state.currentScene.type) {
      case "Scripted":
        this.objects.player.controls.isMovementLocked = true;
        break;
      case "Roaming":
      default:
        this.objects.player.controls.isMovementLocked = false;
        break;
    }
    this._state.currentScene.start();
  }

  public abstract next(currentScene: Scene<unknown>): Scene<unknown>;
}

export type SceneType = "Roaming" | "Scripted";

type Objects = {
  interactable: Record<InteractionType, Phaser.Physics.Arcade.Group>;
  npc: Phaser.Physics.Arcade.Group;
  player: Player;
};

export abstract class Scene<S, T extends SceneType = SceneType> {
  public readonly id: string;
  public readonly area: Area;
  public readonly type: T;
  public readonly host: GameScene;
  public readonly objects: Objects;
  state: S;
  abstract isFinished(): boolean;
  abstract start(): void;
}

export interface State {
  currentScene: Scene<unknown>;
  finishedScenes: Array<Scene<unknown>>;
}
