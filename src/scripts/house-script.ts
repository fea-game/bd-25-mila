import Phaser from "phaser";
import { GameScript, Scene } from "./game-script";
import { Area, InteractionType } from "../common/types";
import GameScene from "../scenes/game-scene";
import { Player } from "../game-objects/characters/player/player";
import { playCinematicIntro } from "./utils";

export class HouseScript extends GameScript {
  private static getScenes = (host: Scene<unknown>["host"], objects: Scene<unknown>["objects"]) => ({
    "house-player-waking-up": new (class extends Scene<{ didWakeUp: boolean }> {
      public readonly id = "house-player-waking-up";
      public readonly type = "Scripted";
      public readonly area = Area.House;
      public readonly host = host;
      public readonly objects = objects;
      state = {
        didWakeUp: false,
      };

      public isFinished() {
        return this.state.didWakeUp;
      }

      public start() {
        playCinematicIntro({
          scene: this.host,
          player: this.objects.player,
          duration: 5000,
          onComplete: () => {
            this.state.didWakeUp = true;
          },
        });
      }
    })(),
    "house-after-waking-up": new (class extends Scene<{}> {
      public readonly id = "house-after-waking-up";
      public readonly type = "Roaming";
      public readonly area = Area.House;
      public readonly host = host;
      state = {
        didGoToLivingRoom: false,
      };

      public isFinished = () => {
        return false;
      };

      public start = () => {};
    })(),
  });

  public constructor(
    host: GameScene,
    objects: {
      interactable: Record<InteractionType, Phaser.Physics.Arcade.Group>;
      npc: Phaser.Physics.Arcade.Group;
      player: Player;
    }
  ) {
    super(host, objects, HouseScript.getScenes(host, objects), "house-player-waking-up");
  }

  public next(currentScene: Scene<unknown>): Scene<unknown> {
    switch (currentScene.id) {
      case "house-player-waking-up":
      default:
        return this.scenes["house-after-waking-up"];
    }
  }
}
