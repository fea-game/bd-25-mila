import { Direction, GameObject } from "../../common/types";
import { BaseGameObjectComponent } from "./base-game-object-component";

export class DirectionComponent extends BaseGameObjectComponent {
  #direction: Direction;
  private onChange?: (direction: Direction) => void;

  constructor(
    host: GameObject,
    onChange?: (direction: Direction) => void,
    intial?: Direction
  ) {
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
}
