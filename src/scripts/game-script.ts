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
    this.gameState.scene.current = firstSceneId;

    if (!this.isScene(this.gameState.scene.current)) {
      throw new Error(`Invalid scene "${firstSceneId}" provided!`);
    }

    this.startCurrentScene();
  }

  public update(time: number, delta: number): void {
    if (!this.isScene(this.gameState.scene.current)) {
      throw new Error(`No valid current Scene present: ${this.gameState.scene.current}!`);
    }

    const currentScene = this.scenes[this.gameState.scene.current];

    if (currentScene.isFinished()) {
      const finishedScene = currentScene;
      this.gameState.scene.finished.push(finishedScene.id);
      this.gameState.scene.current = this.next(finishedScene.id);

      this.startCurrentScene();
    }
  }

  protected startCurrentScene(): void {
    if (!this.isScene(this.gameState.scene.current)) {
      throw new Error(`No valid current Scene present: ${this.gameState.scene.current}!`);
    }

    const currentScene = this.scenes[this.gameState.scene.current];

    switch (currentScene.type) {
      case "Scripted":
        this.objects.player.controls.isMovementLocked = true;
        break;
      case "Roaming":
      default:
        this.objects.player.controls.isMovementLocked = false;
        break;
    }
    currentScene.start();
  }

  protected abstract isScene(value: unknown): value is I;
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
