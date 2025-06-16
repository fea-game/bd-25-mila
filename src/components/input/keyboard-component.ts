import Phaser from "phaser";
import { InputComponent } from "./input-component";

export class KeyboardComponent extends InputComponent implements Keyboard {
  #cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
  #actionKey: Phaser.Input.Keyboard.Key;
  protected keyboard: Phaser.Input.Keyboard.KeyboardPlugin;

  constructor(keyboardPlugin: Phaser.Input.Keyboard.KeyboardPlugin) {
    super();

    this.#cursorKeys = keyboardPlugin.createCursorKeys();
    this.#actionKey = keyboardPlugin.addKey(Phaser.Input.Keyboard.KeyCodes[Keyboard.Key.Action]);
    this.keyboard = keyboardPlugin;
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

  public on(...args: Parameters<Phaser.Input.Keyboard.KeyboardPlugin["on"]>): Keyboard {
    this.keyboard.on(...args);

    return this;
  }

  public once(...args: Parameters<Phaser.Input.Keyboard.KeyboardPlugin["once"]>): Keyboard {
    this.keyboard.once(...args);

    return this;
  }

  public off(...args: Parameters<Phaser.Input.Keyboard.KeyboardPlugin["off"]>): Keyboard {
    this.keyboard.off(...args);

    return this;
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
  readonly on: (...args: Parameters<Phaser.Input.Keyboard.KeyboardPlugin["on"]>) => Keyboard;
  readonly once: (...args: Parameters<Phaser.Input.Keyboard.KeyboardPlugin["once"]>) => Keyboard;
  readonly off: (...args: Parameters<Phaser.Input.Keyboard.KeyboardPlugin["off"]>) => Keyboard;
}

export const Keyboard = {
  Key: {
    Action: "X",
    Down: "DOWN",
    Left: "LEFT",
    Right: "RIGHT",
    Up: "UP",
  } as const satisfies Record<string, keyof typeof Phaser.Input.Keyboard.KeyCodes>,

  toEvent(event: "keydown" | "keyup", key: (typeof Keyboard.Key)[keyof typeof Keyboard.Key]): string {
    return `${event}-${key}`;
  },
};
