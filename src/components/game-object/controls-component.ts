import { GameObject } from "../../common/types";
import { InputComponent } from "../input/input-component";
import { BaseGameObjectComponent } from "./base-game-object-component";

export class ControlsComponent extends BaseGameObjectComponent {
  private inputControls: InputComponent;

  constructor(gameObject: GameObject, inputComponent: InputComponent) {
    super(gameObject);
    this.inputControls = inputComponent;
  }

  get input(): InputComponent {
    return this.inputControls;
  }
}
