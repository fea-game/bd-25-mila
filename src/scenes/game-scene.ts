import Phaser from "phaser";
import { Area, SceneKey } from "../common/types";
import { KeyboardComponent } from "../components/input/keyboard-component";
import { Player } from "../game-objects/characters/player/player";
import { AreaComponent } from "../components/game-scene/area-component";

export default class GameScene extends Phaser.Scene {
  private keyboardComponent: KeyboardComponent;
  private areaComponent: AreaComponent;
  public player: Player;

  constructor() {
    super({ key: SceneKey.Game });
  }

  create() {
    if (!this.input.keyboard) {
      console.warn("Phaser keyboard plugin not enabled");
      return;
    }

    this.keyboardComponent = new KeyboardComponent(this.input.keyboard);
    this.areaComponent = new AreaComponent(this, Area.House);

    this.player = new Player({
      scene: this,
      x: 850,
      y: 400,
      input: this.keyboardComponent,
    });

    this.cameras.main.startFollow(this.player);

    this.areaComponent.movableObjects.getChildren().forEach((movableObject) => {
      if (!(movableObject instanceof Phaser.Physics.Arcade.Sprite)) return;

      movableObject.setDrag(200);
      movableObject.setMaxVelocity(300);
    });

    this.physics.add.collider(this.player, this.areaComponent.collisionLayer);
    this.physics.add.collider(this.areaComponent.movableObjects, this.areaComponent.collisionLayer);
    this.physics.add.collider(this.player, this.areaComponent.movableObjects);
    this.physics.add.collider(this.areaComponent.movableObjects, this.areaComponent.movableObjects);
  }
}
