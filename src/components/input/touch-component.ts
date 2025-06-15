import { Depth } from "../../common/config";
import { EventBus } from "../../common/event-bus";
import { InputComponent } from "./input-component";
import { Keyboard } from "./keyboard-component";

export class TouchComponent extends InputComponent implements Keyboard {
  constructor(scene: Phaser.Scene) {
    super();

    this.#setupTouchButtons(scene);
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

  #setupTouchButtons(scene: Phaser.Scene) {
    const size = 128;
    const pad = 48;
    const y = scene.scale.height - size - pad;

    const createBtn = (x: number, y: number, key: string, frame: number, onDown: () => void, onUp: () => void) => {
      const btn = scene.add
        .image(x, y, key, frame)
        .setInteractive()
        .setScrollFactor(0)
        .setDepth(100)
        .setAlpha(0.3)
        .setOrigin(0.5)
        .setScale(8)
        .setDepth(100);

      btn.on("pointerdown", () => onDown());
      btn.on("pointerup", () => onUp());
      btn.on("pointerout", () => onUp());
    };

    const downX = pad + size;
    const downY = y + size;
    const leftX = pad + size / 2;
    const rightX = pad + size * 1.5 + 10;
    const upX = pad + size;
    const upY = y - size;
    const actionX = scene.scale.width - size - pad;

    createBtn(
      actionX,
      y,
      "controls",
      0,
      () => {
        this.isActionKeyJustDown = true;
        EventBus.instance.emit(Keyboard.toEvent("keydown", Keyboard.Key.Action));
      },
      () => (this.isActionKeyJustDown = false)
    );
    createBtn(
      downX,
      downY,
      "controls",
      1,
      () => {
        EventBus.instance.emit(Keyboard.toEvent("keydown", Keyboard.Key.Down));
        this.isDownDown = true;
      },
      () => (this.isDownDown = false)
    );
    createBtn(
      leftX,
      y,
      "controls",
      2,
      () => {
        EventBus.instance.emit(Keyboard.toEvent("keydown", Keyboard.Key.Left));
        this.isLeftDown = true;
      },
      () => (this.isLeftDown = false)
    );
    createBtn(
      rightX,
      y,
      "controls",
      3,
      () => {
        EventBus.instance.emit(Keyboard.toEvent("keydown", Keyboard.Key.Right));
        this.isRightDown = true;
      },
      () => (this.isRightDown = false)
    );
    createBtn(
      upX,
      upY,
      "controls",
      4,
      () => {
        EventBus.instance.emit(Keyboard.toEvent("keydown", Keyboard.Key.Up));
        this.isUpDown = true;
      },
      () => (this.isUpDown = false)
    );
  }
}
