import Phaser from "phaser";
import { Depth } from "../common/config";
import GameScene from "../scenes/game-scene";

type DialogOption = {
  text: string;
  callback: () => void;
};

export class DialogBox extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private textObject: Phaser.GameObjects.Text;
  private continueText: Phaser.GameObjects.Text;
  private optionTexts: Phaser.GameObjects.Text[] = [];

  private fullText = "";
  private pages: string[] = [];
  private currentPageIndex = 0;

  private readonly padding = 20;
  private readonly textHeight: number;
  private readonly lineHeight = 24;
  private options: DialogOption[] = [];

  constructor(scene: GameScene, width: number, height: number) {
    super(scene, 0, scene.scale.height - height);

    this.setDepth(Depth.Hud);

    scene.add.existing(this);

    this.background = scene.add.rectangle(0, 0, width, height, 0x800080, 0.8).setOrigin(0, 0);
    this.add(this.background);

    // ✅ Adjust wrap width: subtract *2* padding (left + right)
    this.textObject = scene.add.text(this.padding, this.padding, "", {
      fontSize: "18px",
      wordWrap: { width: width - this.padding * 3 },
      color: "#ffffff",
    });
    this.add(this.textObject);

    this.textHeight = height - this.padding * 2;

    // ✅ Add margin to right for prompt
    this.continueText = scene.add
      .text(width - this.padding, height - this.padding / 2, "[SPACE]", {
        fontSize: "14px",
        color: "#cccccc",
      })
      .setOrigin(1, 1)
      .setVisible(false);
    this.continueText.setX(width - this.continueText.width);
    this.add(this.continueText);

    // Input handling
    scene.input.keyboard.on("keydown-SPACE", this.nextPage, this);
    scene.input.keyboard.on("keydown-ENTER", this.nextPage, this);
    scene.input.keyboard.on("keydown-UP", () => this.selectOption(-1));
    scene.input.keyboard.on("keydown-DOWN", () => this.selectOption(1));
  }

  public setText(text: string) {
    this.clear();
    this.fullText = text;
    this.pages = this.paginate(text);
    this.showPage(0);
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
    this.continueText.setVisible(index < this.pages.length - 1);
    if (index >= this.pages.length - 1) {
      this.showOptions();
    }
  }

  private nextPage() {
    if (this.currentPageIndex < this.pages.length - 1) {
      this.showPage(this.currentPageIndex + 1);
    }
  }

  public setOptions(options: DialogOption[]) {
    this.options = options;
    if (this.currentPageIndex === this.pages.length - 1) {
      this.showOptions();
    }
  }

  private showOptions() {
    this.continueText.setVisible(false);

    const startY = this.textObject.y + this.textObject.height + 10;
    this.optionTexts = this.options.map((opt, index) => {
      const txt = this.scene.add.text(this.padding, startY + index * 24, opt.text, {
        fontSize: "16px",
        color: index === 0 ? "#ffff00" : "#ffffff",
      });
      this.add(txt);
      return txt;
    });

    this.selectedOptionIndex = 0;

    this.scene.input.keyboard.once("keydown-ENTER", () => {
      const selected = this.options[this.selectedOptionIndex];
      selected?.callback();
    });
  }

  private selectedOptionIndex = 0;
  private selectOption(delta: -1 | 1) {
    if (this.optionTexts.length === 0) return;

    this.selectedOptionIndex = Phaser.Math.Wrap(this.selectedOptionIndex + delta, 0, this.optionTexts.length);

    this.optionTexts.forEach((txt, i) => txt.setColor(i === this.selectedOptionIndex ? "#ffff00" : "#ffffff"));
  }

  public clear() {
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
