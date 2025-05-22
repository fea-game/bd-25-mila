import Phaser from "phaser";
import { Area, hasBody, InteractionType, SceneKey } from "../common/types";
import { KeyboardComponent } from "../components/input/keyboard-component";
import { Player } from "../game-objects/characters/player/player";
import { AreaComponent } from "../components/game-scene/area-component";
import { Interactable, isInteractable } from "../components/game-object/object/interactable-component";
import { ActionZoneSize } from "../common/config";

export default class GameScene extends Phaser.Scene {
  #keyboardComponent: KeyboardComponent;
  #areaComponent: AreaComponent;
  #player: Player;
  #currentlyOverlapping: Set<Interactable<InteractionType>>;
  #previouslyOverlapping: Set<Interactable<InteractionType>>;

  constructor() {
    super({ key: SceneKey.Game });
  }

  create() {
    if (!this.input.keyboard) {
      console.warn("Phaser keyboard plugin not enabled");
      return;
    }

    this.#currentlyOverlapping = new Set();
    this.#previouslyOverlapping = new Set();
    this.#keyboardComponent = new KeyboardComponent(this.input.keyboard);
    this.#areaComponent = new AreaComponent(this, Area.House);

    this.#player = new Player({
      scene: this,
      input: this.#keyboardComponent,
      properties: this.#areaComponent.playerSpawnLocation,
    });

    this.cameras.main.startFollow(this.#player);

    this.physics.add.collider(this.#player, this.#areaComponent.collisionLayer);
    this.physics.add.collider(this.#player, this.#areaComponent.movableObjects);
    this.physics.add.collider(this.#areaComponent.npcs, this.#areaComponent.movableObjects);

    this.physics.add.collider(this.#areaComponent.movableObjects, this.#areaComponent.collisionLayer);
    this.physics.add.collider(this.#areaComponent.movableObjects, this.#areaComponent.movableObjects);
  }

  update(): void {
    // Clear this frame's overlap state
    this.#currentlyOverlapping.clear();

    const interactionType = InteractionType.Action;

    // Collect overlaps
    this.physics.overlap(this.#player, this.#areaComponent.interactableObjects[interactionType], (_, trigger) => {
      if (!isInteractable(trigger)) return;
      this.#currentlyOverlapping.add(trigger.host);
    });

    let isPlayerFocused = this.#player.isActor.getFocused(interactionType);

    // No overlaps? Clear everything
    if (this.#currentlyOverlapping.size === 0) {
      if (isPlayerFocused) {
        isPlayerFocused.isInteractable.unfocus();
        this.#player.isActor.unfocus(interactionType);
        isPlayerFocused = undefined;
      }

      this.#previouslyOverlapping.clear();
      return;
    }

    // Determine player's center
    const playerCenter = new Phaser.Math.Vector2(this.#player.body.center.x, this.#player.body.center.y);

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
      this.#player.isActor.focus(nearest);
      nearest.isInteractable.focus(this.#player);
    }

    // Store previous frame's set
    const temp = this.#previouslyOverlapping;
    this.#previouslyOverlapping = this.#currentlyOverlapping;
    this.#currentlyOverlapping = temp;
  }
}
