import Phaser from "phaser";
import { ActionZoneSize } from "../../common/config";
import { hasBody, InteractionType } from "../../common/types";
import { Player } from "../../game-objects/characters/player/player";
import GameScene from "../../scenes/game-scene";
import { Actionable, isActionTrigger } from "../game-object/object/actionable-component";
import { BaseGameSceneComponent } from "./base-game-scene-component";
import { EventBus } from "../../common/event-bus";
import { isContactable } from "../game-object/object/contactable-component";

type InteractionObjects = {
  interactable: Record<InteractionType, Phaser.GameObjects.Group>;
  npc: Phaser.Physics.Arcade.Group;
  player: Player;
};

export class InteractionComponent extends BaseGameSceneComponent {
  #source: InteractionObjects;
  #currentlyOverlapping: Set<Actionable>;
  #previouslyOverlapping: Set<Actionable>;

  constructor(host: GameScene, source: InteractionObjects) {
    super(host);

    this.#source = source;

    this.create();

    this.host.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.host.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.host.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
    });
  }

  public create(): void {
    // Actionable
    this.#currentlyOverlapping = new Set();
    this.#previouslyOverlapping = new Set();

    // Contactable
    this.host.physics.add.overlap(this.#source.player, this.#source.interactable.contact, (_, contactable) => {
      if (!isContactable(contactable)) return;

      EventBus.contacted({ actor: this.#source.player, interactedWith: contactable });
    });

    // Pushable
    this.host.physics.add.collider(this.#source.player, this.#source.interactable.push);
    this.host.physics.add.collider(this.#source.npc, this.#source.interactable.push);
    this.host.physics.add.collider(this.#source.interactable.push, this.#source.interactable.push);
  }

  update(): void {
    this.updateActionables();
  }

  updateActionables(): void {
    // Clear this frame's overlap state
    this.#currentlyOverlapping.clear();

    // Collect overlaps
    this.host.physics.overlap(this.#source.player, this.#source.interactable.action, (_, trigger) => {
      if (!isActionTrigger(trigger)) return;
      this.#currentlyOverlapping.add(trigger.host);
    });

    let isPlayerFocused = this.#source.player.isActor.focused;

    // No overlaps? Clear everything
    if (this.#currentlyOverlapping.size === 0) {
      if (isPlayerFocused) {
        isPlayerFocused.isInteractable.unfocus();
        this.#source.player.isActor.unfocus();
        isPlayerFocused = undefined;
      }

      this.#previouslyOverlapping.clear();
      return;
    }

    // Determine player's center
    const playerCenter = new Phaser.Math.Vector2(this.#source.player.body.center.x, this.#source.player.body.center.y);

    // Find nearest interactable
    let nearest: Actionable | undefined;
    let minDistance = Number.POSITIVE_INFINITY;

    for (const i of this.#currentlyOverlapping) {
      if (!hasBody(i)) {
        minDistance = ActionZoneSize;
        nearest = i;

        continue;
      }

      const center = new Phaser.Math.Vector2(i.body.center.x, i.body.center.y);
      const dist = Phaser.Math.Distance.BetweenPoints(playerCenter, center);

      if (dist < minDistance) {
        minDistance = dist;
        nearest = i;
      }
    }

    // Disable all others
    for (const i of this.#previouslyOverlapping) {
      if (i !== nearest) {
        i.isInteractable.unfocus();
      }
    }

    // Enable nearest
    if (nearest && nearest !== isPlayerFocused) {
      isPlayerFocused = nearest;
      this.#source.player.isActor.focus(nearest);
      nearest.isInteractable.focus(this.#source.player);
    }

    // Store previous frame's set
    const temp = this.#previouslyOverlapping;
    this.#previouslyOverlapping = this.#currentlyOverlapping;
    this.#currentlyOverlapping = temp;
  }
}
