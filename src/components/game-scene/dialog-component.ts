import GameScene from "../../scenes/game-scene";
import { BaseGameSceneComponent } from "./base-game-scene-component";
import { Keyboard } from "../input/keyboard-component";
import { DialogBox } from "../../ui/dialog-box";

export class DialogComponent extends BaseGameSceneComponent {
  #keyboard: Keyboard;
  #dialog: DialogBox;

  constructor(host: GameScene, keyboard: Keyboard) {
    super(host);

    this.#keyboard = keyboard;
    this.#dialog = new DialogBox(host, this.#keyboard);
  }

  public show(...args: Parameters<DialogBox["show"]>) {
    this.#dialog.show(...args);
  }

  public hide() {
    this.#dialog.hide();
  }
}

export interface Dialog {
  show: DialogComponent["show"];
  hide: DialogComponent["hide"];
}
