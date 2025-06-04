import { Direction, GameObject } from "../../../common/types";
import { BaseGameObjectComponent } from "../base-game-object-component";

export class DirectionComponent extends BaseGameObjectComponent {
  #direction: Direction;
  private onChange?: (direction: Direction) => void;

  constructor(host: GameObject, onChange?: (direction: Direction) => void, intial?: Direction) {
    super(host);
    this.direction = intial ?? Direction.Down;
    this.onChange = onChange;
  }

  get direction(): Direction {
    return this.#direction;
  }

  set direction(direction: Direction) {
    this.#direction = direction;
    this.onChange?.(direction);
  }

  public getDirectionTo(target: GameObject): Direction {
    const vec = new Phaser.Math.Vector2(target.x - this.host.x, target.y - this.host.y);
    const degrees = Phaser.Math.RadToDeg(vec.angle());

    switch (true) {
      case degrees >= 45 && degrees < 135:
        return Direction.Down;
      case degrees >= 135 && degrees < 225:
        return Direction.Left;
      case degrees >= 225 && degrees < 315:
        return Direction.Up;
      default:
        return Direction.Right;
    }
  }
}
