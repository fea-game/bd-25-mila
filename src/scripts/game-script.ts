import GameScene from "../scenes/game-scene";
import { Objects } from "../components/game-scene/objects-component";
import { GameStateManager } from "../manager/game-state-manager";
import { Dialog } from "../components/game-scene/dialog-component";

export abstract class GameScript<
  I extends string = string,
  T extends SceneType = SceneType,
  S extends Scene<I, T> = Scene<I, T>,
  R extends Record<I, S> = Record<I, S>
> {
  protected scenes: R;

  public constructor(
    protected readonly host: GameScene,
    protected readonly objects: Objects,
    protected readonly dialog: Dialog
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
    GameStateManager.instance.scene.current = firstSceneId;

    if (!this.isScene(GameStateManager.instance.scene.current)) {
      throw new Error(`Invalid scene "${firstSceneId}" provided!`);
    }

    this.startCurrentScene();
  }

  public update(time: number, delta: number): void {
    if (!this.isScene(GameStateManager.instance.scene.current)) {
      throw new Error(`No valid current Scene present: ${GameStateManager.instance.scene.current}!`);
    }

    const currentScene = this.scenes[GameStateManager.instance.scene.current];

    if (currentScene.isFinished()) {
      const finishedScene = currentScene;
      GameStateManager.instance.scene.finished.push(finishedScene.id);
      GameStateManager.instance.scene.current = this.next(finishedScene.id);

      this.startCurrentScene();
    }
  }

  protected showDialog(...args: Parameters<Dialog["show"]>) {
    this.objects.player.controls.isMovementLocked = true;
    this.dialog.show(...args);
  }

  protected hideDialog() {
    this.dialog.hide();

    if (!this.isScene(GameStateManager.instance.scene.current)) {
      throw new Error(`No valid current Scene present: ${GameStateManager.instance.scene.current}!`);
    }

    this.objects.player.controls.isMovementLocked =
      this.scenes[GameStateManager.instance.scene.current].type === "Roaming";
  }

  protected startCurrentScene(): void {
    if (!this.isScene(GameStateManager.instance.scene.current)) {
      throw new Error(`No valid current Scene present: ${GameStateManager.instance.scene.current}!`);
    }

    this.host.cameras.main.startFollow(this.objects.player);

    const currentScene = this.scenes[GameStateManager.instance.scene.current];

    switch (currentScene.type) {
      case "Scripted":
        this.objects.player.controls.isMovementLocked = true;
        break;
      case "Roaming":
      default:
        this.objects.player.controls.isMovementLocked = false;
        break;
    }

    GameStateManager.instance.persist();

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
