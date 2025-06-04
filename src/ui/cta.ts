import Phaser from "phaser";
import { Depth } from "../common/config";
import { TextStyle } from "./text-style";

type Config = {
  host: Phaser.Scene;
  content:
    | [{ texture: string; frame?: string | number }]
    | [{ texture: string; frame?: string | number }, string | undefined]
    | [string, { texture: string; frame?: string | number }];
  x?: number;
  y?: number;
};

export class Cta extends Phaser.GameObjects.Container {
  private static ImageBounce = -4;

  private static isImageRight(
    content: Config["content"]
  ): content is [string, { texture: string; frame?: string | number }] {
    return typeof content[0] === "string";
  }

  protected image: Phaser.GameObjects.Image;
  protected text?: Phaser.GameObjects.Text;
  protected tween?: Phaser.Tweens.Tween;

  constructor(config: Config) {
    super(config.host, config.x ?? 0, config.y ?? 0);

    const [imagePosition, image, text] = ((content: Config["content"]) => {
      if (Cta.isImageRight(content)) {
        return ["right", content[1], content[0]] as const;
      }

      return ["left", content[0], content[1]] as const;
    })(config.content);

    this.addImage(image, text ? imagePosition : "center");

    if (text) {
      this.addText(text, imagePosition === "left" ? "right" : "left");
    }

    this.setDepth(Depth.Hud);
  }

  private addImage(image: { texture: string; frame?: string | number }, position: "center" | "left" | "right") {
    this.image = this.scene.add.image(0, 0, image.texture, image.frame).setScale(2);

    switch (position) {
      case "center":
        this.image.setOrigin(0.5, 0.5);
        break;
      case "left":
        this.image.setOrigin(1, 0.5);
        this.image.setX(2);
        break;
      case "right":
        this.image.setOrigin(0, 0.5);
        this.image.setX(-2);
        break;
      default:
    }

    this.add(this.image);
  }

  private addText(text: string, position: "left" | "right") {
    this.text = this.scene.add.text(0, 0, text, TextStyle.new().withBorder().get());

    switch (position) {
      case "left":
        this.text.setOrigin(1, 0.5);
        this.image.setX(2);
        break;
      case "right":
        this.text.setOrigin(0, 0.5);
        this.image.setX(-2);
        break;
      default:
    }

    this.text.setY(Cta.ImageBounce / 2);

    this.add(this.text);
  }

  show(): Cta {
    this.tween =
      this.tween ??
      this.scene.tweens.add({
        targets: this.image,
        y: this.image.y + Cta.ImageBounce,
        duration: 300,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

    this.setVisible(true);

    return this;
  }

  hide(): Cta {
    this.tween?.stop();
    this.tween = undefined;

    this.setVisible(false);

    return this;
  }
}
