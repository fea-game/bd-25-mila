import Phaser from "phaser";
import { ActionZoneSize } from "../../common/config";
import { hasBody, InteractionType } from "../../common/types";
import { Player } from "../../game-objects/characters/player/player";
import GameScene from "../../scenes/game-scene";
import { Interactable, isInteractable } from "../game-object/object/interactable-component";
import { BaseGameSceneComponent } from "./base-game-scene-component";

type InteractionObjects = {
  interactableObjects: Record<InteractionType, Phaser.Physics.Arcade.Group>;
  player: Player;
};

export class InteractionComponent extends BaseGameSceneComponent {
  #source: InteractionObjects;
  #currentlyOverlapping: Set<Interactable<InteractionType>>;
  #previouslyOverlapping: Set<Interactable<InteractionType>>;

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
    this.#currentlyOverlapping = new Set();
    this.#previouslyOverlapping = new Set();
  }

  update(): void {
    // Clear this frame's overlap state
    this.#currentlyOverlapping.clear();

    const interactionType = InteractionType.Action;

    // Collect overlaps
    this.host.physics.overlap(this.#source.player, this.#source.interactableObjects[interactionType], (_, trigger) => {
      if (!isInteractable(trigger)) return;
      this.#currentlyOverlapping.add(trigger.host);
    });

    let isPlayerFocused = this.#source.player.isActor.getFocused(interactionType);

    // No overlaps? Clear everything
    if (this.#currentlyOverlapping.size === 0) {
      if (isPlayerFocused) {
        isPlayerFocused.isInteractable.unfocus();
        this.#source.player.isActor.unfocus(interactionType);
        isPlayerFocused = undefined;
      }

      this.#previouslyOverlapping.clear();
      return;
    }

    // Determine player's center
    const playerCenter = new Phaser.Math.Vector2(this.#source.player.body.center.x, this.#source.player.body.center.y);

    // Find nearest interactable
    let nearest: Interactable<typeof interactionType> | undefined;
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
