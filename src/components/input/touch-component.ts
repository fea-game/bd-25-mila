import { EventBus } from "../../common/event-bus";
import { InputComponent } from "./input-component";
import { Keyboard } from "./keyboard-component";

export class TouchComponent extends InputComponent implements Keyboard {
  constructor() {
    super();
    this.#setupHtmlButtons();
  }

  public on(...args: Parameters<Phaser.Input.Keyboard.KeyboardPlugin["on"]>): Keyboard {
    EventBus.instance.on(...args);
    return this;
  }

  public once(...args: Parameters<Phaser.Input.Keyboard.KeyboardPlugin["once"]>): Keyboard {
    EventBus.instance.once(...args);
    return this;
  }

  public off(...args: Parameters<Phaser.Input.Keyboard.KeyboardPlugin["off"]>): Keyboard {
    EventBus.instance.off(...args);
    return this;
  }

  #setupHtmlButtons() {
    const map = {
      up: Keyboard.Key.Up,
      down: Keyboard.Key.Down,
      left: Keyboard.Key.Left,
      right: Keyboard.Key.Right,
      action: Keyboard.Key.Action,
    } as const;

    const onDown = (key: (typeof map)[keyof typeof map]) => {
      this.#setKeyState(key, true);
      EventBus.instance.emit(Keyboard.toEvent("keydown", key));
    };

    const onUp = (key: (typeof map)[keyof typeof map]) => {
      this.#setKeyState(key, false);
      EventBus.instance.emit(Keyboard.toEvent("keyup", key));
    };

    Object.values(map).forEach((key) => {
      const btn = document.querySelector(`button[data-action="${key}"]`) as HTMLButtonElement | null;
      if (!btn) return;

      btn.addEventListener("touchstart", (e) => {
        e.preventDefault(); // prevent ghost clicks
        onDown(key);
      });
      btn.addEventListener("touchend", (e) => {
        e.preventDefault(); // prevent ghost clicks
        onUp(key);
      });
      btn.addEventListener("touchcancel", (e) => {
        e.preventDefault(); // prevent ghost clicks
        onUp(key);
      });

      btn.addEventListener("mousedown", (e) => {
        e.preventDefault(); // prevent ghost clicks
        onDown(key);
      });
      btn.addEventListener("mouseup", (e) => {
        e.preventDefault(); // prevent ghost clicks
        onUp(key);
      });
      btn.addEventListener("mouseout", (e) => {
        e.preventDefault(); // prevent ghost clicks
        onUp(key);
      });
    });
  }

  #setKeyState(key: typeof Keyboard.Key, isDown: boolean) {
    switch (key) {
      case Keyboard.Key.Up:
        this.isUpDown = isDown;
        break;
      case Keyboard.Key.Down:
        this.isDownDown = isDown;
        break;
      case Keyboard.Key.Left:
        this.isLeftDown = isDown;
        break;
      case Keyboard.Key.Right:
        this.isRightDown = isDown;
        break;
      case Keyboard.Key.Action:
        this.isActionKeyJustDown = isDown;
        break;
    }
  }
}
