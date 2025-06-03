import Phaser from "phaser";
import { Player } from "../../game-objects/characters/player";
import GameScene from "../../scenes/game-scene";
import { BaseGameSceneComponent } from "./base-game-scene-component";
import { InteractionType } from "../../common/types";

type CollisionObjects = {
  collision: Phaser.GameObjects.Group;
  npc: Phaser.Physics.Arcade.Group;
  player: Player;
  interactable: Record<InteractionType, Phaser.GameObjects.Group>;
};

export class CollisionComponent extends BaseGameSceneComponent {
  #source: CollisionObjects;

  constructor(host: GameScene, source: CollisionObjects) {
    super(host);

    this.#source = source;

    this.create();
  }

  public create(): void {
    // Player Collision
    this.host.physics.add.collider(this.#source.player, this.#source.collision);

    // NPC Collision
    this.host.physics.add.collider(this.#source.npc, this.#source.collision);

    // Pushable Object Collision
    this.host.physics.add.collider(this.#source.interactable.push, this.#source.collision);
  }
}
