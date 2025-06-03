import Phaser from "phaser";
import { Depth } from "../common/config";
import { GameObject } from "../common/types";

type Config = {
  host: GameObject;
  content:
    | [{ texture: string; frame?: string | number }]
    | [{ texture: string; frame?: string | number }, string | undefined]
    | [string, { texture: string; frame?: string | number }];
};

export class Indicator extends Phaser.GameObjects.Container {
  private static DistanceToHost = 20;

  private static isImageRight(
    content: Config["content"]
  ): content is [string, { texture: string; frame?: string | number }] {
    console.log("isImageRight", typeof content[0] === "string", content);
    return typeof content[0] === "string";
  }

  #host: GameObject;
  #image: Phaser.GameObjects.Image;
  #text?: Phaser.GameObjects.Text;
  #tween?: Phaser.Tweens.Tween;

  constructor(config: Config) {
    super(config.host.scene, 0, -Indicator.DistanceToHost);

    this.#host = config.host;

    const [imagePosition, image, text] = ((content: Config["content"]) => {
      if (Indicator.isImageRight(content)) {
        return ["right", content[1], content[0]] as const;
      }

      return ["left", content[0], content[1]] as const;
    })(config.content);

    this.addImage(image, text ? imagePosition : "center");

    if (text) {
      this.addText(text, imagePosition === "left" ? "right" : "left");
    }

    this.scene.add.existing(this);

    this.setDepth(Depth.Indicators);
    this.update();
  }

  private addImage(image: { texture: string; frame?: string | number }, position: "center" | "left" | "right") {
    this.#image = this.scene.add.image(0, 0, image.texture, image.frame);

    console.log("image", position);

    switch (position) {
      case "center":
        this.#image.setOrigin(0.5, 0.5);
        break;
      case "left":
        this.#image.setOrigin(1, 0.5);
        this.#image.setX(2);
        break;
      case "right":
        this.#image.setOrigin(0, 0.5);
        this.#image.setX(-2);
        break;
      default:
    }

    this.add(this.#image);
  }

  private addText(text: string, position: "left" | "right") {
    this.#text = this.scene.add.text(0, 0, text, {
      fontSize: "10px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 3,
    });

    console.log("text", position);

    switch (position) {
      case "left":
        this.#text.setOrigin(1, 0.5);
        this.#image.setX(2);
        break;
      case "right":
        this.#text.setOrigin(0, 0.5);
        this.#image.setX(-2);
        break;
      default:
    }

    this.#text.setY(-(this.#image.height - this.#text.height) / 2);

    this.add(this.#text);
  }

  show(): void {
    this.#tween =
      this.#tween ??
      this.scene.tweens.add({
        targets: this.#image,
        y: this.#image.y - 5, // float up by 5 pixels
        duration: 400,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

    this.setVisible(true);
  }

  hide(): void {
    this.#tween?.stop();
    this.#tween = undefined;

    this.setVisible(false);
  }

  update(): void {
    const host = this.#host;
    const topY = host.y - host.displayHeight * host.originY;
    const centerX = host.x - host.displayWidth * (host.originX - 0.5);

    const baseY = topY - Indicator.DistanceToHost;
    this.setX(centerX);

    // Only update Y if no tween exists yet (tween manages Y afterward)
    if (!this.#tween) {
      this.setY(baseY);
    }
  }
}
