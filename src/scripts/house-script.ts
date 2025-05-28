import { GameScript, Scene } from "./game-script";
import { Direction } from "../common/types";
import GameScene from "../scenes/game-scene";
import { assertNpcsPresent, getNpcs, playCinematicIntro } from "./utils";
import { EventBus } from "../common/event-bus";
import { Trigger } from "../game-objects/objects/trigger";
import { Npc } from "../game-objects/characters/npc";
import { GameState } from "../components/game-scene/state-component";
import { Objects } from "../components/game-scene/objects-component";

type HouseScriptScene = "house-waking-up" | "house-after-waking-up" | "house-singing-happy-birthday";

export class HouseScript extends GameScript<HouseScriptScene> {
  public readonly npcs: {
    father: Npc;
    mother: Npc;
    sister: Npc;
  };

  public constructor(host: GameScene, objects: Objects, gameState: GameState) {
    super(host, objects, gameState);

    const npcs = getNpcs(objects);

    assertNpcsPresent(npcs, ["father", "mother", "sister"]);

    this.npcs = npcs;

    this.add(
      class extends Scene {
        public readonly id = "house-waking-up";
        public readonly type = "Scripted";

        public isFinished() {
          return this.script.gameState.house.wokeUp;
        }

        public start() {
          playCinematicIntro({
            scene: this.script.host,
            player: this.script.objects.player,
            duration: 5000,
            onComplete: () => {
              this.script.gameState.house.wokeUp = true;
            },
          });
        }
      },
      class extends Scene {
        declare script: HouseScript;

        public readonly id = "house-after-waking-up";
        public readonly type = "Roaming";

        public isFinished() {
          return this.script.gameState.house.wentToLivingRoom && this.script.gameState.house.sisterMoved;
        }

        public start() {
          this.script.host.cameras.main.startFollow(this.script.objects.player);

          this.script.host.time.delayedCall(2000, () => {
            this.script.npcs.sister.move(
              [
                { direction: Direction.Left, distance: 170 },
                { direction: Direction.Down, distance: 200 },
                { direction: Direction.Right, distance: 20 },
              ],
              () => {
                this.script.gameState.house.sisterMoved = true;
              }
            );
          });

          EventBus.instance.once(
            EventBus.getSubject(EventBus.Event.Contacted, Trigger.Id.House.HallwayLivingRoomTransition),
            () => {
              this.script.gameState.house.wentToLivingRoom = true;
            }
          );
        }
      },
      class extends Scene {
        declare script: HouseScript;

        public readonly id = "house-singing-happy-birthday";
        public readonly type = "Scripted";

        isFinished() {
          return false;
        }

        async start() {
          this.script.host.cameras.main.startFollow(this.script.objects.player);

          await this.moveFamily();
        }

        async moveFamily() {
          await Promise.allSettled([
            new Promise((resolve) => {
              this.script.npcs.father.move(
                [
                  {
                    direction: Direction.Down,
                    distance: this.script.objects.player.y - this.script.npcs.father.y + 36,
                  },
                  { direction: Direction.Left, distance: 110 },
                ],
                () => {
                  resolve(undefined);
                }
              );
            }),
            new Promise((resolve) => {
              this.script.npcs.mother.move(
                [
                  {
                    direction: Direction.Down,
                    distance: this.script.objects.player.y - this.script.npcs.mother.y - 36,
                  },
                  { direction: Direction.Left, distance: 100 },
                ],
                () => {
                  resolve(undefined);
                }
              );
            }),
            new Promise((resolve) => {
              this.script.npcs.sister.move(
                [{ direction: Direction.Up, distance: this.script.npcs.sister.y - this.script.objects.player.y }],
                () => {
                  this.script.npcs.sister.turn(Direction.Left, () => {
                    resolve(undefined);
                  });
                }
              );
            }),
          ]);
        }
      }
    );

    this.start("house-waking-up");
  }

  public next(currentScene: HouseScriptScene): HouseScriptScene {
    switch (currentScene) {
      case "house-waking-up":
        return "house-after-waking-up";
      case "house-after-waking-up":
        return "house-singing-happy-birthday";
      default:
        return "house-waking-up";
    }
  }
}
