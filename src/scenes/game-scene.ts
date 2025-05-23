import Phaser from "phaser";
import { Area, SceneKey } from "../common/types";
import { KeyboardComponent } from "../components/input/keyboard-component";
import { Player } from "../game-objects/characters/player/player";
import { AreaComponent } from "../components/game-scene/area-component";
import { CollisionComponent } from "../components/game-scene/collision-component";
import { InteractionComponent } from "../components/game-scene/interaction-component";

export default class GameScene extends Phaser.Scene {
  #areaComponent: AreaComponent;
  #collisionComponent: CollisionComponent;
  #interactionComponent: InteractionComponent;
  #keyboardComponent: KeyboardComponent;
  #player: Player;

  constructor() {
    super({ key: SceneKey.Game });
  }

  create() {
    if (!this.input.keyboard) {
      throw new Error("Phaser keyboard plugin not enabled");
    }

    this.physics.world.createDebugGraphic();

    this.#keyboardComponent = new KeyboardComponent(this.input.keyboard);
    this.#areaComponent = new AreaComponent(this, Area.House);

    this.#player = new Player({
      scene: this,
      input: this.#keyboardComponent,
      properties: this.#areaComponent.playerSpawnLocation,
    });

    this.#collisionComponent = new CollisionComponent(this, {
      collisionLayer: this.#areaComponent.collisionLayer,
      npcs: this.#areaComponent.npcs,
      pushableObjects: this.#areaComponent.pushableObjects,
      player: this.#player,
    });

    this.#interactionComponent = new InteractionComponent(this, {
      interactableObjects: this.#areaComponent.interactableObjects,
      player: this.#player,
    });

    this.cameras.main.startFollow(this.#player);
  }
}
