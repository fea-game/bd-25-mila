import Phaser from "phaser";
import { Area, SceneKey } from "../common/types";
import { KeyboardComponent } from "../components/input/keyboard-component";
import { CollisionComponent } from "../components/game-scene/collision-component";
import { InteractionComponent } from "../components/game-scene/interaction-component";
import { ObjectsComponent } from "../components/game-scene/objects-component";
import { GameScript } from "../scripts/game-script";
import { HouseScript } from "../scripts/house-script";
import { DialogComponent } from "../components/game-scene/dialog-component";

export default class GameScene extends Phaser.Scene {
  #collisionComponent: CollisionComponent;
  #dialogComponent: DialogComponent;
  #interactionComponent: InteractionComponent;
  #keyboardComponent: KeyboardComponent;
  #objectsComponent: ObjectsComponent;
  #script: GameScript;

  constructor() {
    super({ key: SceneKey.Game });
  }

  create() {
    if (!this.input.keyboard) {
      throw new Error("Phaser keyboard plugin not enabled");
    }

    this.#keyboardComponent = new KeyboardComponent(this.input.keyboard);
    this.#objectsComponent = ObjectsComponent.for({
      host: this,
      area: Area.House,
      keyboard: this.#keyboardComponent,
    });
    this.#collisionComponent = new CollisionComponent(this, this.#objectsComponent);
    this.#interactionComponent = new InteractionComponent(this, this.#objectsComponent);
    this.#dialogComponent = new DialogComponent(this, this.#keyboardComponent);

    this.#script = new HouseScript(this, this.#objectsComponent, this.#dialogComponent);
  }

  update(time: number, delta: number): void {
    this.#script.update(time, delta);
  }
}
