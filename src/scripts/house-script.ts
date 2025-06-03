import { GameScript, Scene } from "./game-script";
import { Direction } from "../common/types";
import GameScene from "../scenes/game-scene";
import { playCinematicIntro } from "./utils";
import { EventBus } from "../common/event-bus";
import { Trigger } from "../game-objects/objects/trigger";
import { Npc } from "../game-objects/characters/npc";
import { Objects } from "../components/game-scene/objects-component";
import { Audio } from "../common/assets";
import { assertNpcsPresent, getNpcs } from "../common/utils";
import { GameStateManager } from "../manager/game-state-manager";
import { DialogBox } from "../ui/dialog-box";

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
    Amelie: Npc;
    Cynthia: Npc;
    Tobias: Npc;
  };

  public constructor(host: GameScene, objects: Objects) {
    super(host, objects);

    const npcs = getNpcs(objects);

    assertNpcsPresent(npcs, ["Amelie", "Cynthia", "Tobias"]);

    this.npcs = npcs;

    this.add(
      class extends Scene {
        public readonly id = "house-waking-up";
        public readonly type = "Scripted";

        public isFinished() {
          return GameStateManager.instance.house.wokeUp;
        }

        public start() {
          const dialog = new DialogBox(host, host.scale.width, 150);

          dialog.setText(
            "It's your birthday today! Everyone is waiting in the living room to celebrate with you. " +
              "You should get ready and head downstairs as soon as possible. There's cake!" +
              "It's your birthday today! Everyone is waiting in the living room to celebrate with you. " +
              "You should get ready and head downstairs as soon as possible. There's cake!" +
              "It's your birthday today! Everyone is waiting in the living room to celebrate with you. " +
              "You should get ready and head downstairs as soon as possible. There's cake!"
          );

          dialog.setOptions([
            { text: "Go downstairs", callback: () => console.log("Player chose to go downstairs") },
            { text: "Stay in room", callback: () => console.log("Player stayed") },
          ]);

          /*playCinematicIntro({
            scene: this.script.host,
            player: this.script.objects.player,
            duration: 5000,
            onComplete: () => {
              GameStateManager.instance.house.wokeUp = true;
            },
          });*/
        }
      },
      class extends Scene {
        declare script: HouseScript;

        public readonly id = "house-after-waking-up";
        public readonly type = "Roaming";

        public isFinished() {
          return GameStateManager.instance.house.wentToLivingRoom && GameStateManager.instance.house.sisterMoved;
        }

        public start() {
          this.script.host.time.delayedCall(2000, () => {
            console.log("MOVE AMELIE", [this.script.npcs.Amelie.x, this.script.npcs.Amelie.y]);
            this.script.npcs.Amelie.move(
              [
                { direction: Direction.Left, distance: 170 },
                { direction: Direction.Down, distance: 200 },
                { direction: Direction.Right, distance: 30 },
              ],
              () => {
                GameStateManager.instance.house.sisterMoved = true;
              }
            );
          });

          EventBus.instance.once(
            EventBus.getSubject(EventBus.Event.Contacted, Trigger.Id.House.HallwayLivingRoomTransition),
            () => {
              GameStateManager.instance.house.wentToLivingRoom = true;
            }
          );
        }
      },
      class extends Scene {
        declare script: HouseScript;

        public readonly id = "house-singing-happy-birthday";
        public readonly type = "Scripted";

        isFinished() {
          return GameStateManager.instance.house.happyBirthdaySung;
        }

        async start() {
          await this.moveFamily();
          await this.singHappyBirthday();

          GameStateManager.instance.house.happyBirthdaySung = true;
        }

        async moveFamily() {
          await Promise.allSettled([
            new Promise((resolve) => {
              this.script.npcs.Tobias.move(
                [
                  {
                    direction: Direction.Down,
                    distance: this.script.objects.player.y - this.script.npcs.Tobias.y + 36,
                  },
                  { direction: Direction.Left, distance: 95 },
                ],
                () => {
                  resolve(undefined);
                }
              );
            }),
            new Promise((resolve) => {
              this.script.npcs.Cynthia.move(
                [
                  {
                    direction: Direction.Down,
                    distance: this.script.objects.player.y - this.script.npcs.Cynthia.y - 36,
                  },
                  { direction: Direction.Left, distance: 90 },
                ],
                () => {
                  resolve(undefined);
                }
              );
            }),
            new Promise((resolve) => {
              this.script.npcs.Amelie.move(
                [{ direction: Direction.Up, distance: this.script.npcs.Amelie.y - this.script.objects.player.y }],
                () => {
                  this.script.npcs.Amelie.turn(Direction.Left, () => {
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

        public start() {}
      }
    );

    this.start(
      this.isScene(GameStateManager.instance.scene.current)
        ? GameStateManager.instance.scene.current
        : "house-waking-up"
    );
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
