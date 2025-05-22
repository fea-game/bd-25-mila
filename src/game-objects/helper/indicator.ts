import Phaser from "phaser";
import { Depth } from "../../common/config";
import { GameObject } from "../../common/types";

type Config = {
  host: GameObject;
  texture: string;
  frame?: string | number;
};

export class Indicator extends Phaser.GameObjects.Image {
  private static DistanceToHost = 10;

  #host: GameObject;
  #tween?: Phaser.Tweens.Tween;

  constructor(config: Config) {
    super(config.host.scene, 0, 0, config.texture, config.frame);

    this.#host = config.host;

    this.scene.add.existing(this);
    this.setOrigin(0.5, 1);
    this.setDepth(Depth.Indicators);
    this.update();
  }

  show(): void {
    this.#tween =
      this.#tween ??
      this.scene.tweens.add({
        targets: this,
        y: this.y - 5, // float up by 5 pixels
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
