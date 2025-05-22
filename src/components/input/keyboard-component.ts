import Phaser from "phaser";
import { InputComponent } from "./input-component";

export class KeyboardComponent extends InputComponent {
  public static readonly ActionKey: keyof typeof Phaser.Input.Keyboard.KeyCodes = "X";

  #cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  #actionKey: Phaser.Input.Keyboard.Key;

  constructor(keyboardPlugin: Phaser.Input.Keyboard.KeyboardPlugin) {
    super();

    this.#cursorKeys = keyboardPlugin.createCursorKeys();
    this.#actionKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes[KeyboardComponent.ActionKey]);
  }

  override get isUpDown(): boolean {
    return this.#cursorKeys.up.isDown;
  }
  override get isUpJustDown(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.#cursorKeys.up);
  }

  override get isDownDown(): boolean {
    return this.#cursorKeys.down.isDown;
  }
  override get isDownJustDown(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.#cursorKeys.down);
  }

  override get isLeftDown(): boolean {
    return this.#cursorKeys.left.isDown;
  }

  override get isRightDown(): boolean {
    return this.#cursorKeys.right.isDown;
  }

  override get isActionKeyJustDown(): boolean {
    return Phaser.Input.Keyboard.JustDown(this.#actionKey);
  }
}
