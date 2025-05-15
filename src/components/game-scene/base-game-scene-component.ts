import GameScene from "../../scenes/game-scene";

export abstract class BaseGameSceneComponent {
  protected host: GameScene;

  constructor(host: GameScene) {
    this.host = host;
  }
}
