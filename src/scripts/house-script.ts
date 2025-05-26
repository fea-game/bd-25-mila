import Phaser from "phaser";
import { GameScript, Scene } from "./game-script";
import { Area, Direction, InteractionType } from "../common/types";
import GameScene from "../scenes/game-scene";
import { Player } from "../game-objects/characters/player/player";
import { playCinematicIntro } from "./utils";
import { EventBus } from "../common/event-bus";
import { Trigger } from "../game-objects/objects/trigger";
import { Npc } from "../game-objects/characters/npc";

export class HouseScript extends GameScript {
  private static getNpcs = (objects: Scene<unknown>["objects"]): Npcs => {
    return objects.npc.getChildren().reduce((npcs: Npcs, npc) => {
      if (!(npc instanceof Npc)) return npcs;

      switch (npc.npcType) {
        case "Amelie":
          npcs.sister = npc;
          break;
        case "Cynthia":
          npcs.mother = npc;
          break;
        case "Tobias":
          npcs.father = npc;
          break;
      }

      return npcs;
    }, {});
  };

  private static getScenes = (host: Scene<unknown>["host"], objects: Scene<unknown>["objects"]) => ({
    "house-waking-up": new (class extends Scene<{ wokeUp: boolean }> {
      public readonly id = "house-waking-up";
      public readonly type = "Scripted";
      public readonly area = Area.House;
      public readonly host = host;
      public readonly objects = objects;
      state = {
        wokeUp: false,
      };

      public isFinished() {
        return this.state.wokeUp;
      }

      public start() {
        playCinematicIntro({
          scene: this.host,
          player: this.objects.player,
          duration: 5000,
          onComplete: () => {
            this.state.wokeUp = true;
          },
        });
      }
    })(),
    "house-after-waking-up": new (class extends Scene<{
      sisterMoved: boolean;
      wentToLivingRoom: boolean;
    }> {
      public readonly id = "house-after-waking-up";
      public readonly type = "Roaming";
      public readonly area = Area.House;
      public readonly host = host;
      public readonly objects = objects;
      state = {
        sisterMoved: false,
        wentToLivingRoom: false,
      };

      public isFinished() {
        return this.state.wentToLivingRoom && this.state.sisterMoved;
      }

      public start() {
        this.host.cameras.main.startFollow(this.objects.player);

        const { sister } = HouseScript.getNpcs(this.objects);

        if (sister) {
          this.host.time.delayedCall(2000, () => {
            sister.move(
              [
                { direction: Direction.Left, distance: 170 },
                { direction: Direction.Down, distance: 200 },
                { direction: Direction.Right, distance: 20 },
              ],
              () => {
                this.state.sisterMoved = true;
              }
            );
          });
        }

        EventBus.instance.once(
          EventBus.getSubject(EventBus.Event.Contacted, Trigger.Id.House.HallwayLivingRoomTransition),
          () => {
            this.state.wentToLivingRoom = true;
          }
        );
      }
    })(),
    "house-singing-happy-birthday": new (class extends Scene<{ finishedSinging: boolean }> {
      public readonly id = "house-singing-happy-birthday";
      public readonly type = "Scripted";
      public readonly area = Area.House;
      public readonly host = host;
      public readonly objects = objects;
      state = {
        finishedSinging: false,
      };

      public isFinished() {
        return false;
      }

      public async start() {
        this.host.cameras.main.startFollow(this.objects.player);

        await this.moveFamily();
      }

      private async moveFamily() {
        const { father, mother, sister } = HouseScript.getNpcs(this.objects);

        await Promise.allSettled([
          father
            ? new Promise((resolve) => {
                father.move(
                  [
                    { direction: Direction.Down, distance: this.objects.player.y - father.y + 36 },
                    { direction: Direction.Left, distance: 110 },
                  ],
                  () => {
                    resolve(undefined);
                  }
                );
              })
            : undefined,
          mother
            ? new Promise((resolve) => {
                mother.move(
                  [
                    { direction: Direction.Down, distance: this.objects.player.y - mother.y - 36 },
                    { direction: Direction.Left, distance: 100 },
                  ],
                  () => {
                    resolve(undefined);
                  }
                );
              })
            : undefined,
          sister
            ? new Promise((resolve) => {
                sister.move([{ direction: Direction.Up, distance: sister.y - this.objects.player.y }], () => {
                  sister.turn(Direction.Left, () => {
                    resolve(undefined);
                  });
                });
              })
            : undefined,
        ]);

        // TODO: sing
      }
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
    super(host, objects, HouseScript.getScenes(host, objects), "house-after-waking-up");
  }

  public next(currentScene: Scene<unknown>): Scene<unknown> {
    switch (currentScene.id) {
      case "house-waking-up":
        return this.scenes["house-after-waking-up"];
      case "house-after-waking-up":
        return this.scenes["house-singing-happy-birthday"];
      default:
        return this.scenes["house-waking-up"];
    }
  }
}

type Npcs = { father?: Npc; mother?: Npc; sister?: Npc };
