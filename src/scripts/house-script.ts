import { GameScript, Scene, SceneType } from "./game-script";
import { Direction } from "../common/types";
import GameScene from "../scenes/game-scene";
import { playCinematicIntro } from "./utils";
import { EventBus, EventPayload } from "../common/event-bus";
import { Trigger } from "../game-objects/objects/trigger";
import { Npc } from "../game-objects/characters/npc";
import { Objects } from "../components/game-scene/objects-component";
import { Audio } from "../common/assets";
import {
  assertNpcsPresent,
  getCrumbs,
  getNpcs,
  getPlate,
  isWithId,
} from "../common/utils";
import { GameStateManager } from "../manager/game-state-manager";
import { Dialog } from "../components/game-scene/dialog-component";
import { HouseDialogs } from "./dialogs/house-dialogs";
import { Dialog as DialogContent } from "./dialogs/dialog-script";
import { Actionable } from "../components/game-object/object/actionable-component";
import { Contactable } from "../components/game-object/object/contactable-component";
import { Crumbs } from "../game-objects/objects/crumbs";
import { Plate } from "../game-objects/objects/plate";
import { Depth } from "../common/config";

const HouseScriptScene = {
  WakingUp: "house-waking-up",
  AfterWakingUp: "house-after-waking-up",
  SigningHappyBirthday: "house-singing-happy-birthday",
  AfterSigningHappyBirthday: "house-after-singing-happy-birthday",
  AfterDiscoveringMissingCake: "house-after-discovering-missing-cake",
  AfterObtainingCake: "house-after-obtaining-cake",
  AfterPuttingBackCake: "house-after-putting-back-cake",
} as const;

type HouseScriptScene =
  (typeof HouseScriptScene)[keyof typeof HouseScriptScene];

const HouseScriptSceneValues: string[] = Object.values(HouseScriptScene);

export class HouseScript extends GameScript<HouseScriptScene> {
  protected declare scenes: Record<
    HouseScriptScene,
    HouseScene<HouseScriptScene, SceneType>
  >;

  public readonly crumbs: Crumbs[];
  public readonly npcs: {
    Amelie: Npc;
    Cynthia: Npc;
    Thief: Npc;
    Tobias: Npc;
  };
  public readonly plate: Plate;

  public constructor(host: GameScene, objects: Objects, dialog: Dialog) {
    super(host, objects, dialog);

    this.crumbs = getCrumbs(objects);

    const plate = getPlate(objects);
    if (!plate) {
      throw new Error("No Plate found!");
    }
    this.plate = plate;

    const npcs = getNpcs(objects);
    assertNpcsPresent(npcs, ["Amelie", "Cynthia", "Thief", "Tobias"]);
    this.npcs = npcs;

    this.hideThief();

    this.add(
      class extends HouseScene {
        public readonly id = HouseScriptScene.WakingUp;
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
        public readonly id = HouseScriptScene.AfterWakingUp;
        public readonly type = "Roaming";

        public isFinished() {
          return (
            GameStateManager.instance.house.wentToLivingRoom &&
            GameStateManager.instance.house.sisterMoved
          );
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
            EventBus.getSubject(
              EventBus.Event.Contacted,
              Trigger.Id.House.HallwayLivingRoomTransition
            ),
            ({ interactedWith }: { interactedWith: Contactable }) => {
              interactedWith.isInteractable.canBeInteractedWith = false;
              GameStateManager.instance.house.wentToLivingRoom = true;
            }
          );
        }
      },
      class extends HouseScene {
        public readonly id = HouseScriptScene.SigningHappyBirthday;
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
                    distance:
                      this.script.objects.player.y -
                      this.script.npcs.Tobias.y +
                      36,
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
                    distance:
                      this.script.objects.player.y -
                      this.script.npcs.Cynthia.y -
                      36,
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
                [
                  {
                    direction: Direction.Up,
                    distance:
                      this.script.npcs.Amelie.y - this.script.objects.player.y,
                  },
                ],
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
        public readonly id = HouseScriptScene.AfterSigningHappyBirthday;
        public readonly type = "Roaming";

        public isFinished() {
          return GameStateManager.instance.house.discoveredCakeIsMissing;
        }

        public start() {
          super.start();

          this.script.plate.isInteractable.canBeInteractedWith = true;
          EventBus.instance.on(
            EventBus.getSubject(EventBus.Event.Acted),
            this.onInteract,
            this
          );
        }

        private onInteract({
          interactedWith,
        }: EventPayload[typeof EventBus.Event.Acted]) {
          interactedWith.isInteractable.canBeInteractedWith = false;

          if (isWithId(interactedWith, "Amelie", "Cynthia", "Tobias")) {
            this.interactWith(interactedWith);
            return;
          }

          if (interactedWith.id === "plate-1") {
            const dialog = HouseDialogs.Narrator.current();
            if (!dialog) return;

            this.script.showDialog(dialog, {
              on: (event, _?: number) => {
                if (event === "closed") {
                  EventBus.instance.off(
                    EventBus.getSubject(EventBus.Event.Acted),
                    this.onInteract,
                    this
                  );
                  GameStateManager.instance.house.discoveredCakeIsMissing =
                    true;
                }
              },
            });
            return;
          }
        }

        private interactWith(
          actionable: Actionable & { id: "Amelie" | "Cynthia" | "Tobias" }
        ) {
          const dialog = HouseDialogs[actionable.id].current();
          if (!dialog) return;

          this.script.showDialog(dialog, {
            on: (event, _?: number) => {},
          });
        }
      },
      class extends HouseScene {
        public readonly id = HouseScriptScene.AfterDiscoveringMissingCake;
        public readonly type = "Roaming";

        public isFinished() {
          return GameStateManager.instance.house.obtainedCake;
        }

        public start() {
          super.start();

          this.script.enableThiefInteraction();

          EventBus.instance.on(
            EventBus.getSubject(EventBus.Event.Acted),
            this.onInteract,
            this
          );

          this.script.crumbs.forEach((crumbs) => {
            crumbs.isInteractable.canBeInteractedWith = !crumbs.isRevealed;

            if (crumbs.isInteractable.canBeInteractedWith) {
              EventBus.instance.once(
                EventBus.getSubject(EventBus.Event.Contacted, crumbs.id),
                this.onContact,
                this
              );
            }
          });
        }

        private onContact({ interactedWith }: { interactedWith: Contactable }) {
          if (!(interactedWith instanceof Crumbs)) return;

          interactedWith.isInteractable.canBeInteractedWith = false;
          interactedWith.isRevealed = true;
          GameStateManager.instance.house.numCrumbsDiscovered += 1;

          const dialog = HouseDialogs.Narrator.current();
          if (!dialog) return;

          this.script.showDialog(dialog);
        }

        private onInteract({
          interactedWith,
        }: EventPayload[typeof EventBus.Event.Acted]) {
          interactedWith.isInteractable.canBeInteractedWith = false;

          if (isWithId(interactedWith, "Amelie", "Cynthia", "Tobias")) {
            this.interactWith(interactedWith);
            return;
          }

          if (isWithId(interactedWith, "Thief")) {
            this.interactWithThief(interactedWith);
            return;
          }
        }

        private interactWith(
          actionable: Actionable & { id: "Amelie" | "Cynthia" | "Tobias" }
        ) {
          const dialog = HouseDialogs[actionable.id].current();
          if (!dialog) return;

          this.script.showDialog(dialog, {
            on: (type, _?: number) => {
              if (dialog.id === "dialog-house-tobias-4") {
                GameStateManager.instance.house.foodForThiefReceived = true;

                const dialog = HouseDialogs.Narrator.current();
                if (!dialog) return;

                this.script.showDialog(dialog);
              }
            },
          });
        }

        private interactWithThief(actionable: Actionable & { id: "Thief" }) {
          if (!GameStateManager.instance.house.discoveredThief) {
            this.script.showThief();
            this.script.npcs.Thief.move(
              [{ direction: Direction.Left, distance: 128 }],
              () => {
                const dialog = HouseDialogs[actionable.id].current();
                if (!dialog) return;

                this.script.showDialog(dialog, {
                  on: (type, _?: number) => {
                    GameStateManager.instance.house.discoveredThief = true;

                    const dialog = HouseDialogs.Narrator.current();
                    if (!dialog) return;

                    this.script.showDialog(dialog);
                  },
                });
              }
            );

            return;
          }

          const dialog = HouseDialogs[actionable.id].current();
          if (!dialog) return;

          this.script.showDialog(dialog, {
            on: (type, _?: number) => {
              if (dialog.id === "dialog-house-thief-2") {
                this.script.npcs.Thief.isInteractable.canBeInteractedWith =
                  false;
                this.script.npcs.Thief.move(
                  [
                    { direction: Direction.Down, distance: 100 },
                    { direction: Direction.Left, distance: 150 },
                    { direction: Direction.Down, distance: 150 },
                    { direction: Direction.Right, distance: 400 },
                    { direction: Direction.Up, distance: 200 },
                    { direction: Direction.Right, distance: 150 },
                    { direction: Direction.Up, distance: 50 },
                    { direction: Direction.Right, distance: 150 },
                  ],
                  () => {
                    this.script.hideThief();
                  }
                );

                GameStateManager.instance.house.obtainedCake = true;

                let dialog = HouseDialogs.Narrator.current();
                if (!dialog) return;

                this.script.showDialog(dialog);
              }
            },
          });
        }
      },
      class extends HouseScene {
        public readonly id = HouseScriptScene.AfterObtainingCake;
        public readonly type = "Roaming";

        public isFinished() {
          return GameStateManager.instance.house.putCakeBack;
        }

        public start() {
          super.start();

          this.script.plate.isInteractable.canBeInteractedWith = true;
          EventBus.instance.on(
            EventBus.getSubject(EventBus.Event.Acted),
            this.onInteract,
            this
          );
        }

        private onInteract({
          interactedWith,
        }: EventPayload[typeof EventBus.Event.Acted]) {
          interactedWith.isInteractable.canBeInteractedWith = false;

          if (isWithId(interactedWith, "Amelie", "Cynthia", "Tobias")) {
            this.interactWith(interactedWith);
            return;
          }

          if (interactedWith.id === "plate-1") {
            this.script.plate.isWithCake = true;
            this.script.plate.isInteractable.canBeInteractedWith = false;
            GameStateManager.instance.house.putCakeBack = true;
            return;
          }
        }

        private interactWith(
          actionable: Actionable & { id: "Amelie" | "Cynthia" | "Tobias" }
        ) {
          const dialog = HouseDialogs[actionable.id].current();
          if (!dialog) return;

          this.script.showDialog(dialog);
        }
      },
      class extends HouseScene {
        public readonly id = HouseScriptScene.AfterPuttingBackCake;
        public readonly type = "Roaming";

        public isFinished() {
          return false;
        }

        public start() {
          super.start();

          EventBus.instance.on(
            EventBus.getSubject(EventBus.Event.Acted),
            this.onInteract,
            this
          );

          const dialog = HouseDialogs.Narrator.current();
          if (!dialog) return;

          this.script.showDialog(dialog);

          const texture = this.script.host.textures.createCanvas(
            "particleTexture",
            10,
            10
          );
          if (!texture) return;

          const context = texture.getContext();
          context.fillStyle = "#ffffff";
          context.fillRect(0, 0, 10, 10);
          texture.refresh();

          this.script.host.add
            .particles(0, 0, "particleTexture", {
              emitZone: {
                type: "random",
                quantity: 1,
                source: new Phaser.Geom.Rectangle(
                  0,
                  0,
                  this.script.host.cameras.main.width,
                  1
                ),
              },
              speedY: { min: 200, max: 300 },
              speedX: { min: -100, max: 100 },
              accelerationY: { min: 50, max: 100 },
              lifespan: { min: 2000, max: 3000 },
              scaleX: {
                onUpdate: (particle, key, t) => {
                  // console.log('particle', particle, key, t);
                  return Math.sin((t / 1) * Math.PI * 10);
                },
              },
              blendMode: "ADD",
              rotate: { min: -180, max: 180 },
              frequency: 50,
              quantity: 2,
              tint: [
                0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff,
              ],
            })
            .setDepth(Depth.Overlay)
            .setScrollFactor(0);
        }

        private onInteract({
          interactedWith,
        }: EventPayload[typeof EventBus.Event.Acted]) {
          interactedWith.isInteractable.canBeInteractedWith = false;

          if (isWithId(interactedWith, "Amelie", "Cynthia", "Tobias")) {
            this.interactWith(interactedWith);
            return;
          }
        }

        private interactWith(
          actionable: Actionable & { id: "Amelie" | "Cynthia" | "Tobias" }
        ) {
          const dialog = HouseDialogs[actionable.id].current();
          if (!dialog) return;

          this.script.showDialog(dialog, {
            on: (...args) => {
              console.log("ON", ...args);
              if (
                args[0] === "selected" &&
                dialog.id === "dialog-house-tobias-7"
              ) {
                switch (args[1]) {
                  case 0:
                    GameStateManager.instance.clear();
                    window.location.reload();
                    break;
                  case 1:
                    this.script.hideDialog(dialog);
                }
              }
            },
          });
        }
      }
    );

    this.start(
      this.isScene(GameStateManager.instance.scene.current)
        ? GameStateManager.instance.scene.current
        : HouseScriptScene.WakingUp
    );
  }

  public hideThief() {
    this.npcs.Thief.setVisible(false);
    this.npcs.Thief.body.checkCollision.none = true;
    this.npcs.Thief.isInteractable.trigger.body.checkCollision.none = true;
    this.npcs.Thief.isInteractable.canBeInteractedWith = false;
  }

  public enableThiefInteraction() {
    this.npcs.Thief.body.checkCollision.none = false;
    this.npcs.Thief.isInteractable.trigger.body.checkCollision.none = false;
    this.npcs.Thief.isInteractable.canBeInteractedWith = true;
  }

  public showThief() {
    this.npcs.Thief.setVisible(true);
    this.enableThiefInteraction();
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
      case HouseScriptScene.WakingUp:
        return HouseScriptScene.AfterWakingUp;
      case HouseScriptScene.AfterWakingUp:
        return HouseScriptScene.SigningHappyBirthday;
      case HouseScriptScene.SigningHappyBirthday:
        return HouseScriptScene.AfterSigningHappyBirthday;
      case HouseScriptScene.AfterSigningHappyBirthday:
        return HouseScriptScene.AfterDiscoveringMissingCake;
      case HouseScriptScene.AfterDiscoveringMissingCake:
        return HouseScriptScene.AfterObtainingCake;
      case HouseScriptScene.AfterObtainingCake:
        return HouseScriptScene.AfterPuttingBackCake;
      default:
        return HouseScriptScene.WakingUp;
    }
  }
}

abstract class HouseScene<
  I extends string = string,
  T extends SceneType = SceneType
> extends Scene<I, T> {
  declare script: HouseScript;

  public start(): void {
    this.resetNpcInteractions();
  }

  public resetNpcInteractions(): void {
    for (const npc of Object.values(this.script.npcs)) {
      npc.isInteractable.canBeInteractedWith =
        !!HouseDialogs[npc.characterType]?.current();
    }
  }
}
