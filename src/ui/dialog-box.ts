import Phaser from "phaser";
import { Depth } from "../common/config";
import GameScene from "../scenes/game-scene";
import { Keyboard } from "../components/input/keyboard-component";
import { TextStyle } from "./text-style";
import { Cta } from "./cta";

type DialogOption = string;

type Event = ["selected", number] | ["proceeded"] | ["closed"];

export class DialogBox extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private textObject: Phaser.GameObjects.Text;
  private continueText: Cta;
  private closeText: Cta;
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

    this.textObject = scene.add.text(
      this.padding,
      this.padding,
      "",
      TextStyle.new()
        .add({ wordWrap: { width: width - this.padding * 2 } })
        .get()
    );
    this.add(this.textObject);

    this.textHeight = height - this.padding * 2;

    this.continueText = new Cta({
      host: scene,
      content: [{ texture: "controls", frame: 0 }, "Weiter"],
      x: width - this.padding,
      y: height - this.padding,
    });
    this.continueText.setVisible(false).setX(width - this.continueText.getBounds().width);
    this.add(this.continueText);

    this.closeText = new Cta({
      host: scene,
      content: [{ texture: "controls", frame: 0 }, "Schließen"],
      x: width - this.padding,
      y: height - this.padding,
    });
    this.closeText.setVisible(false).setX(width - this.closeText.getBounds().width);
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
      this.continueText.show();
      return;
    }

    this.continueText.hide();

    if (this.options.length) {
      this.showOptions();
      return;
    }

    this.closeText.show();
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
    this.continueText.hide();
    this.closeText.hide();

    const startY = this.textObject.y + this.textObject.height + 10;
    this.optionTexts = this.options.map((opt, index) => {
      const txt = this.scene.add.text(
        this.padding,
        startY + index * 24,
        opt,
        TextStyle.new()
          .color(index === 0 ? "#ffff00" : "#ffffff")
          .get()
      );
      this.add(txt);
      return txt;
    });

    this.selectedOptionIndex = 0;
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
    this.continueText.hide();
    this.closeText.hide();
  }
}
