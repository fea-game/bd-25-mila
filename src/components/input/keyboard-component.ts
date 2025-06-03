import Phaser from "phaser";
import { InputComponent } from "./input-component";

export class KeyboardComponent extends InputComponent implements Keyboard {
  #cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  #actionKey: Phaser.Input.Keyboard.Key;
  #keyboard: Phaser.Input.Keyboard.KeyboardPlugin;

  constructor(keyboardPlugin: Phaser.Input.Keyboard.KeyboardPlugin) {
    super();

    this.#cursorKeys = keyboardPlugin.createCursorKeys();
    this.#actionKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes[Keyboard.Key.Action]);
    this.#keyboard = keyboardPlugin;
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

  public on(
    ...args: Parameters<Phaser.Input.Keyboard.KeyboardPlugin["on"]>
  ): ReturnType<Phaser.Input.Keyboard.KeyboardPlugin["on"]> {
    return this.#keyboard.on(...args);
  }

  public once(
    ...args: Parameters<Phaser.Input.Keyboard.KeyboardPlugin["once"]>
  ): ReturnType<Phaser.Input.Keyboard.KeyboardPlugin["once"]> {
    return this.#keyboard.once(...args);
  }

  public off(
    ...args: Parameters<Phaser.Input.Keyboard.KeyboardPlugin["off"]>
  ): ReturnType<Phaser.Input.Keyboard.KeyboardPlugin["off"]> {
    return this.#keyboard.off(...args);
  }
}

export interface Keyboard {
  readonly isUpDown: boolean;
  readonly isUpJustDown: boolean;
  readonly isDownDown: boolean;
  readonly isDownJustDown: boolean;
  readonly isLeftDown: boolean;
  readonly isRightDown: boolean;
  readonly isActionKeyJustDown: boolean;
  readonly on: Phaser.Input.Keyboard.KeyboardPlugin["on"];
  readonly once: Phaser.Input.Keyboard.KeyboardPlugin["once"];
  readonly off: Phaser.Input.Keyboard.KeyboardPlugin["off"];
}

export const Keyboard = {
  Key: {
    Action: "X",
    Down: "DOWN",
    Left: "LEFT",
    Right: "RIGHT",
    Up: "UP",
  } as const satisfies Record<string, keyof typeof Phaser.Input.Keyboard.KeyCodes>,

  toEvent(event: "keydown", key: (typeof Keyboard.Key)[keyof typeof Keyboard.Key]): string {
    return `${event}-${key}`;
  },
};
