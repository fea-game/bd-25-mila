import Phaser from "phaser";
import { Player } from "../../game-objects/characters/player/player";
import GameScene from "../../scenes/game-scene";
import { BaseGameSceneComponent } from "./base-game-scene-component";

type CollisionObjects = {
  collision: Phaser.GameObjects.Group;
  npc: Phaser.Physics.Arcade.Group;
  player: Player;
  pushable: Phaser.GameObjects.Group;
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
    this.host.physics.add.collider(this.#source.player, this.#source.pushable);

    // NPC Collision
    this.host.physics.add.collider(this.#source.npc, this.#source.pushable);

    // Inter-Object Collision
    this.host.physics.add.collider(this.#source.pushable, this.#source.collision);
    this.host.physics.add.collider(this.#source.pushable, this.#source.pushable);
  }
}
