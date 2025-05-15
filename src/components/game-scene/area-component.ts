import {
  getAreaImage,
  getAreaTileset,
  ImageType,
  Map,
  TilesetType,
} from "../../common/assets";
import { Depth } from "../../common/config";
import { getAreaLayer, Layer, LayerType } from "../../common/map";
import { Area } from "../../common/types";
import GameScene from "../../scenes/game-scene";
import { BaseGameSceneComponent } from "./base-game-scene-component";

export class AreaComponent extends BaseGameSceneComponent {
  private area: Area;
  #collisionLayer: Phaser.Tilemaps.TilemapLayer;

  constructor(host: GameScene, area: Area) {
    super(host);

    this.area = area;
    this.create();
  }

  private create(): void {
    this.host.add
      .image(0, 0, getAreaImage(this.area, ImageType.Background), 0)
      .setOrigin(0)
      .setDepth(Depth.Background);

    this.host.add
      .image(0, 0, getAreaImage(this.area, ImageType.Foreground), 0)
      .setOrigin(0)
      .setDepth(Depth.Foreground);

    const map = this.host.make.tilemap({ key: `${this.area}-map` });

    const collisionTiles = map.addTilesetImage(
      getAreaTileset(this.area, TilesetType.Collision),
      getAreaImage(this.area, ImageType.Collision)
    );
    if (!collisionTiles) {
      throw new Error("Error while creating collision tileset!");
    }

    const collisionLayer = map.createLayer(
      getAreaLayer(this.area, LayerType.Collision),
      [collisionTiles],
      0,
      0
    );
    if (!collisionLayer) {
      throw new Error("Error while creating collision layer!");
    }

    this.#collisionLayer = collisionLayer.setDepth(Depth.Collision).setAlpha(0);
    this.#collisionLayer.setCollision([2]);
  }

  get collisionLayer(): Phaser.Tilemaps.TilemapLayer {
    return this.#collisionLayer;
  }
}
