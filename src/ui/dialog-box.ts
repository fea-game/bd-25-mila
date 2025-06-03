import Phaser from "phaser";
import { Depth } from "../common/config";
import GameScene from "../scenes/game-scene";
import { Keyboard } from "../components/input/keyboard-component";

type DialogOption = string;

type Event = ["selected", number] | ["proceeded"] | ["closed"];

export class DialogBox extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private textObject: Phaser.GameObjects.Text;
  private continueText: Phaser.GameObjects.Text;
  private closeText: Phaser.GameObjects.Text;
  private optionTexts: Phaser.GameObjects.Text[] = [];

  private fullText = "";
  private pages: string[] = [];
  private currentPageIndex = 0;

  private readonly padding = 20;
  private readonly textHeight: number;
  private options: DialogOption[] = [];
  private keyboard: Keyboard;

  private eventHandler?: (...args: Event) => void;

  constructor(scene: GameScene, keyboard: Keyboard) {
    const width = scene.scale.width;
    const height = Math.round(scene.scale.height / 4);

    super(scene, 0, scene.scale.height - height);

    this.keyboard = keyboard;

    this.setDepth(Depth.Hud);
    this.setScrollFactor(0);

    scene.add.existing(this);

    this.background = scene.add.rectangle(0, 0, width, height, 0x800080, 0.8).setOrigin(0, 0);
    this.add(this.background);

    this.textObject = scene.add.text(this.padding, this.padding, "", {
      fontSize: "18px",
      wordWrap: { width: width - this.padding * 2 },
      color: "#ffffff",
    });
    this.add(this.textObject);

    this.textHeight = height - this.padding * 2;

    this.continueText = scene.add
      .text(width - this.padding, height - this.padding / 2, "Weiter", {
        fontSize: "14px",
        color: "#cccccc",
      })
      .setOrigin(1, 1)
      .setVisible(false);
    this.continueText.setX(width - this.continueText.width);
    this.add(this.continueText);

    this.closeText = scene.add
      .text(width - this.padding, height - this.padding / 2, "Schließen", {
        fontSize: "14px",
        color: "#cccccc",
      })
      .setOrigin(1, 1)
      .setVisible(false);
    this.closeText.setX(width - this.closeText.width);
    this.add(this.closeText);

    // Input handling
    this.keyboard.on(Keyboard.toEvent("keydown", Keyboard.Key.Action), this.onActionDown, this);
    this.keyboard.on(Keyboard.toEvent("keydown", Keyboard.Key.Up), () => this.selectOption(-1));
    this.keyboard.on(Keyboard.toEvent("keydown", Keyboard.Key.Down), () => this.selectOption(1));

    this.hide();
  }

  public hide() {
    this.eventHandler?.("closed");
    this.clear();
    this.active = false;
    this.setVisible(false);
  }

  public show(text: string, opts: { options?: DialogOption[]; on?: DialogBox["eventHandler"] } = {}) {
    this.clear();
    this.options = opts.options || [];
    this.eventHandler = opts.on;
    this.active = true;
    this.pages = this.paginate(text);
    this.currentPageIndex = 0;
    this.showPage(0);
    this.setVisible(true);
  }

  private paginate(text: string): string[] {
    const words = text.split(" ");
    const pages: string[] = [];

    let page = "";
    this.textObject.setText("");

    for (const word of words) {
      const test = page + word + " ";
      this.textObject.setText(test.trim());

      if (this.textObject.height > this.textHeight) {
        pages.push(page.trim());
        page = word + " ";
      } else {
        page = test;
      }
    }

    if (page.trim().length > 0) pages.push(page.trim());

    return pages;
  }

  private showPage(index: number) {
    this.currentPageIndex = index;
    this.textObject.setText(this.pages[index]);

    if (index < this.pages.length - 1) {
      this.continueText.setVisible(true);
      return;
    }

    if (this.options.length) {
      this.showOptions();
      return;
    }

    this.closeText.setVisible(true);
  }

  private onActionDown() {
    if (this.continueText.visible) {
      this.nextPage();
      return;
    }

    if (this.closeText.visible) {
      this.hide();
      return;
    }

    this.eventHandler?.("selected", this.selectedOptionIndex);
  }

  private nextPage() {
    if (this.currentPageIndex < this.pages.length - 1) {
      this.showPage(this.currentPageIndex + 1);
      this.eventHandler?.("proceeded");
    }
  }

  private showOptions() {
    this.continueText.setVisible(false);
    this.closeText.setVisible(false);

    const startY = this.textObject.y + this.textObject.height + 10;
    this.optionTexts = this.options.map((opt, index) => {
      const txt = this.scene.add.text(this.padding, startY + index * 24, opt, {
        fontSize: "16px",
        color: index === 0 ? "#ffff00" : "#ffffff",
      });
      this.add(txt);
      return txt;
    });

    this.selectedOptionIndex = 0;

    /*this.keyboard.once(Keyboard.toEvent("keydown", Keyboard.Key.Action), () => {
      this.eventHandler?.("selected", this.selectedOptionIndex);
    });*/
  }

  private selectedOptionIndex = 0;
  private selectOption(delta: -1 | 1) {
    if (this.optionTexts.length === 0) return;

    this.selectedOptionIndex = Phaser.Math.Wrap(this.selectedOptionIndex + delta, 0, this.optionTexts.length);

    this.optionTexts.forEach((txt, i) => txt.setColor(i === this.selectedOptionIndex ? "#ffff00" : "#ffffff"));
  }

  public clear() {
    this.options = [];
    this.eventHandler = undefined;
    this.textObject.setText("");
    this.pages = [];
    this.fullText = "";
    this.currentPageIndex = 0;
    this.optionTexts.forEach((txt) => txt.destroy());
    this.optionTexts = [];
    this.selectedOptionIndex = 0;
    this.continueText.setVisible(false);
  }
}
