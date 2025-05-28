import { GameScript, Scene } from "./game-script";
import { Direction } from "../common/types";
import GameScene from "../scenes/game-scene";
import { assertNpcsPresent, getNpcs, playCinematicIntro } from "./utils";
import { EventBus } from "../common/event-bus";
import { Trigger } from "../game-objects/objects/trigger";
import { Npc } from "../game-objects/characters/npc";
import { GameState } from "../components/game-scene/state-component";
import { Objects } from "../components/game-scene/objects-component";
import { Audio } from "../common/assets";

const HouseScriptScene = {
  WakingUp: "house-waking-up",
  AfterWakingUp: "house-after-waking-up",
  SigningHappyBirthday: "house-singing-happy-birthday",
  AfterSigningHappyBirthday: "house-after-singing-happy-birthday",
} as const;

type HouseScriptScene = (typeof HouseScriptScene)[keyof typeof HouseScriptScene];

const HouseScriptSceneValues: string[] = Object.values(HouseScriptScene);

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
          return this.script.gameState.house.happyBirthdaySung;
        }

        async start() {
          this.script.host.cameras.main.startFollow(this.script.objects.player);

          await this.moveFamily();
          await this.singHappyBirthday();

          this.script.gameState.house.happyBirthdaySung = true;
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
                  { direction: Direction.Left, distance: 105 },
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

        async singHappyBirthday(): Promise<void> {
          const sound = this.script.host.sound.add(Audio.HappyBirthday, {
            volume: 1,
          });

          return new Promise((resolve) => {
            sound.once("complete", resolve);
            sound.play();
          });
        }
      },
      class extends Scene {
        declare script: HouseScript;

        public readonly id = "house-after-singing-happy-birthday";
        public readonly type = "Roaming";

        public isFinished() {
          return false;
        }

        public start() {
          this.script.host.cameras.main.startFollow(this.script.objects.player);
        }
      }
    );

    console.log(this.gameState);

    this.start(this.isScene(this.gameState.scene.current) ? this.gameState.scene.current : "house-waking-up");
  }

  protected isScene(value: unknown): value is HouseScriptScene {
    if (!value) return false;
    if (typeof value !== "string") return false;
    if (!HouseScriptSceneValues.includes(value)) return false;

    return true;
  }

  public next(currentScene: HouseScriptScene): HouseScriptScene {
    switch (currentScene) {
      case "house-waking-up":
        return "house-after-waking-up";
      case "house-after-waking-up":
        return "house-singing-happy-birthday";
      case "house-singing-happy-birthday":
        return "house-after-singing-happy-birthday";
      default:
        return "house-waking-up";
    }
  }
}
