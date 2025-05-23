import Phaser from "phaser";
import { Player } from "../../game-objects/characters/player/player";
import GameScene from "../../scenes/game-scene";
import { BaseGameSceneComponent } from "./base-game-scene-component";

type CollisionObjects = {
  collisionLayer: Phaser.GameObjects.Group;
  npcs: Phaser.Physics.Arcade.Group;
  player: Player;
  pushableObjects: Phaser.GameObjects.Group;
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
    this.host.physics.add.collider(this.#source.player, this.#source.collisionLayer);
    this.host.physics.add.collider(this.#source.player, this.#source.pushableObjects);

    // NPC Collision
    this.host.physics.add.collider(this.#source.npcs, this.#source.pushableObjects);

    // Inter-Object Collision
    this.host.physics.add.collider(this.#source.pushableObjects, this.#source.collisionLayer);
    this.host.physics.add.collider(this.#source.pushableObjects, this.#source.pushableObjects);
  }
}
