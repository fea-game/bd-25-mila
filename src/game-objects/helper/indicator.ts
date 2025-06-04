import { Depth } from "../../common/config";
import { GameObject } from "../../common/types";
import { Cta } from "../../ui/cta";

type Config = {
  host: GameObject;
  content:
    | [{ texture: string; frame?: string | number }]
    | [{ texture: string; frame?: string | number }, string | undefined]
    | [string, { texture: string; frame?: string | number }];
};

export class Indicator extends Cta {
  private static DistanceToHost = 20;

  #host: GameObject;

  constructor(config: Config) {
    super({ host: config.host.scene, content: config.content, x: 0, y: -Indicator.DistanceToHost });

    this.#host = config.host;

    this.setDepth(Depth.Indicators);

    this.scene.add.existing(this);
    this.update();
  }

  update(): void {
    const host = this.#host;
    const topY = host.y - host.displayHeight * host.originY;
    const centerX = host.x - host.displayWidth * (host.originX - 0.5);

    const baseY = topY - Indicator.DistanceToHost;
    this.setX(centerX);

    // Only update Y if no tween exists yet (tween manages Y afterward)
    if (!this.tween) {
      this.setY(baseY);
    }
  }
}
