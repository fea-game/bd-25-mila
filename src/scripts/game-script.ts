import GameScene from "../scenes/game-scene";
import { GameState } from "../components/game-scene/state-component";
import { Objects } from "../components/game-scene/objects-component";

export abstract class GameScript<
  I extends string = string,
  T extends SceneType = SceneType,
  S extends Scene<I, T> = Scene<I, T>,
  R extends Record<I, S> = Record<I, S>
> {
  protected scenes: R;
  protected state: State<S>;

  public constructor(
    public readonly host: GameScene,
    public readonly objects: Objects,
    public readonly gameState: GameState
  ) {
    this.scenes = {} as R;
  }

  public add(...scenes: Array<new (script: GameScript) => S>): GameScript<I, T, S, R> {
    scenes.forEach((ctor) => {
      const scene = new ctor(this);

      this.scenes[scene.id] = scene as R[I];
    });

    return this;
  }

  public start(firstSceneId: I): void {
    this.state = {
      currentScene: this.scenes[firstSceneId],
      finishedScenes: [],
    };

    if (!this.state.currentScene) {
      throw new Error(`Invalid scene "${firstSceneId}" provided!`);
    }

    this.startCurrentScene();
  }

  public update(time: number, delta: number): void {
    if (this.state.currentScene.isFinished()) {
      const finishedScene = this.state.currentScene;
      this.state.finishedScenes.push(finishedScene);
      this.state.currentScene = this.scenes[this.next(finishedScene.id)];

      this.startCurrentScene();
    }
  }

  protected startCurrentScene(): void {
    switch (this.state.currentScene.type) {
      case "Scripted":
        this.objects.player.controls.isMovementLocked = true;
        break;
      case "Roaming":
      default:
        this.objects.player.controls.isMovementLocked = false;
        break;
    }
    this.state.currentScene.start();
  }

  public abstract next(currentScene: I): I;
}

export type SceneType = "Roaming" | "Scripted";

export abstract class Scene<I extends string = string, T extends SceneType = SceneType> {
  constructor(protected readonly script: GameScript) {}

  public abstract readonly id: I;
  public abstract readonly type: T;
  public abstract isFinished(): boolean;
  public abstract start(): void;
}

export interface State<S> {
  currentScene: S;
  finishedScenes: Array<S>;
}
