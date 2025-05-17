import { getAreaImage, getAreaMap, getAreaTileset, ImageType, TilesetType } from "../../common/assets";
import { Depth } from "../../common/config";
import { Area, getAreaLayer, LayerType, LayerTypeKey, SectionId } from "../../common/types";
import { BaseObject } from "../../game-objects/objects/base-object";
import GameScene from "../../scenes/game-scene";
import { BaseGameSceneComponent } from "./base-game-scene-component";

export class AreaComponent extends BaseGameSceneComponent {
  private static ImageLayers: Array<LayerTypeKey> = ["Background", "Foreground"];

  private area: Area;
  #collisionLayer: Phaser.Tilemaps.TilemapLayer;
  #objectsBySection: Record<
    SectionId,
    {
      objects: BaseObject;
    }
  >;

  constructor(host: GameScene, area: Area) {
    super(host);

    this.area = area;
    this.create();
  }

  get collisionLayer(): Phaser.Tilemaps.TilemapLayer {
    return this.#collisionLayer;
  }

  private create(): void {
    this.createImageLayers();
    this.createCollisionLayer();
  }

  private createImageLayers() {
    AreaComponent.ImageLayers.forEach((layerTypeKey) => {
      this.host.add
        .image(0, 0, getAreaImage(this.area, ImageType[layerTypeKey]), 0)
        .setOrigin(0)
        .setDepth(Depth[layerTypeKey]);
    });
  }

  private createCollisionLayer() {
    const map = this.host.make.tilemap({ key: getAreaMap(this.area) });

    const collisionTiles = map.addTilesetImage(
      getAreaTileset(this.area, TilesetType.Collision),
      getAreaImage(this.area, ImageType.Collision)
    );
    if (!collisionTiles) {
      throw new Error("Error while creating collision tileset!");
    }

    const collisionLayer = map.createLayer(getAreaLayer(this.area, LayerType.Collision), [collisionTiles], 0, 0);
    if (!collisionLayer) {
      throw new Error("Error while creating collision layer!");
    }

    this.#collisionLayer = collisionLayer.setDepth(Depth.Collision).setAlpha(0.3);
    this.#collisionLayer.setCollision([collisionLayer.tileset[0].firstgid]);
  }
}
