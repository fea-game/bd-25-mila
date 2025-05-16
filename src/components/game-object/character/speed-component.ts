import { GameObject } from "../../../common/types";
import { BaseGameObjectComponent } from "../base-game-object-component";

export class SpeedComponent extends BaseGameObjectComponent {
  public readonly speed: number;

  constructor(gameObject: GameObject, speed: number) {
    super(gameObject);
    this.speed = speed;
  }
}
