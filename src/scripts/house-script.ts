import { GameScript, Scene, SceneType } from "./game-script";
import { Direction } from "../common/types";
import GameScene from "../scenes/game-scene";
import { playCinematicIntro } from "./utils";
import { EventBus, EventPayload } from "../common/event-bus";
import { Trigger } from "../game-objects/objects/trigger";
import { Npc, NpcType } from "../game-objects/characters/npc";
import { Objects } from "../components/game-scene/objects-component";
import { Audio } from "../common/assets";
import { assertNpcsPresent, getNpcs } from "../common/utils";
import { GameStateManager } from "../manager/game-state-manager";
import { Dialog } from "../components/game-scene/dialog-component";
import { HouseDialogs } from "./dialogs/house-dialogs";
import { Dialog as DialogContent } from "./dialogs/dialog-script";

const HouseScriptScene = {
  WakingUp: "house-waking-up",
  AfterWakingUp: "house-after-waking-up",
  SigningHappyBirthday: "house-singing-happy-birthday",
  AfterSigningHappyBirthday: "house-after-singing-happy-birthday",
} as const;

type HouseScriptScene = (typeof HouseScriptScene)[keyof typeof HouseScriptScene];

const HouseScriptSceneValues: string[] = Object.values(HouseScriptScene);

export class HouseScript extends GameScript<HouseScriptScene> {
  protected declare scenes: Record<HouseScriptScene, HouseScene<HouseScriptScene, SceneType>>;

  public readonly npcs: {
    Amelie: Npc;
    Cynthia: Npc;
    Tobias: Npc;
  };

  public constructor(host: GameScene, objects: Objects, dialog: Dialog) {
    super(host, objects, dialog);

    const npcs = getNpcs(objects);

    assertNpcsPresent(npcs, ["Amelie", "Cynthia", "Tobias"]);

    this.npcs = npcs;

    this.add(
      class extends HouseScene {
        public readonly id = "house-waking-up";
        public readonly type = "Scripted";

        public isFinished() {
          return GameStateManager.instance.house.wokeUp;
        }

        public async start() {
          super.start();

          await playCinematicIntro({
            scene: this.script.host,
            player: this.script.objects.player,
            duration: 6000,
          });

          const dialog = HouseDialogs.Narrator.get(0);

          if (!dialog || !dialog.isAvailable()) {
            throw new Error("Couldn't find the first Dialog!");
          }

          this.script.showDialog(dialog, {
            on: (event, _?: number) => {
              if (event === "closed") {
                GameStateManager.instance.house.wokeUp = true;
              }
            },
          });
        }
      },
      class extends HouseScene {
        public readonly id = "house-after-waking-up";
        public readonly type = "Roaming";

        public isFinished() {
          return GameStateManager.instance.house.wentToLivingRoom && GameStateManager.instance.house.sisterMoved;
        }

        public start() {
          super.start();

          this.script.host.time.delayedCall(2000, () => {
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
      class extends HouseScene {
        public readonly id = "house-singing-happy-birthday";
        public readonly type = "Scripted";

        isFinished() {
          return GameStateManager.instance.house.happyBirthdaySung;
        }

        async start() {
          super.start();

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
      class extends HouseScene {
        public readonly id = "house-after-singing-happy-birthday";
        public readonly type = "Roaming";

        public isFinished() {
          return false;
        }

        public start() {
          super.start();

          EventBus.instance.on(EventBus.getSubject(EventBus.Event.Acted), this.onInteract, this);
        }

        private onInteract({ interactedWith }: EventPayload[typeof EventBus.Event.Acted]) {
          interactedWith.isInteractable.canBeInteractedWith = false;

          switch (interactedWith.id) {
            case this.script.npcs.Tobias.id:
              this.interactWithTobias();
              break;
            default:
              console.log("INTERACTED WITH", interactedWith.id);
          }
        }

        private interactWithTobias() {
          const dialog = HouseDialogs.Tobias.current();

          if (!dialog) return;

          this.script.showDialog(dialog, {
            on: (event, _?: number) => {},
          });
        }
      }
    );

    this.start(
      this.isScene(GameStateManager.instance.scene.current)
        ? GameStateManager.instance.scene.current
        : "house-waking-up"
    );
  }

  public override hideDialog(dialog: DialogContent): void {
    super.hideDialog(dialog);

    if (!this.isScene(GameStateManager.instance.scene.current)) return;
    const currentScene = this.scenes[GameStateManager.instance.scene.current];
    if (!currentScene) return;

    currentScene.resetNpcInteractions();
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

abstract class HouseScene<I extends string = string, T extends SceneType = SceneType> extends Scene<I, T> {
  declare script: HouseScript;

  public start(): void {
    this.resetNpcInteractions();
  }

  public resetNpcInteractions(): void {
    for (const npc of Object.values(this.script.npcs)) {
      npc.isInteractable.canBeInteractedWith = !!HouseDialogs[npc.characterType]?.current();
    }
  }
}
