import Phaser from "phaser";
import { getAreaImage, getAreaMap, getAreaTileset, ImageType, TilesetType } from "../../common/assets";
import { Depth } from "../../common/config";
import { Area, getAreaLayer, InteractionType, LayerType, LayerTypeKey } from "../../common/types";
import GameScene from "../../scenes/game-scene";
import { BaseGameSceneComponent } from "./base-game-scene-component";
import * as tiled from "../../tiled";
import { Balloon } from "../../game-objects/objects/balloon";
import { Toilet } from "../../game-objects/objects/toilet";

export class AreaComponent extends BaseGameSceneComponent {
  private static ImageLayers: Array<LayerTypeKey> = ["Background", "Foreground"];

  private area: Area;
  private map: Phaser.Tilemaps.Tilemap;
  #collisionLayer: Phaser.Tilemaps.TilemapLayer;
  #interactableObjects: Record<InteractionType, Phaser.GameObjects.Group>;
  #movableObjects: Phaser.GameObjects.Group;
  #playerSpawnLocation: tiled.Player;
  #chunks: Map<tiled.Chunk["id"], {}>;

  constructor(host: GameScene, area: Area) {
    super(host);

    this.area = area;
    this.create();
  }

  get collisionLayer(): Phaser.Tilemaps.TilemapLayer {
    return this.#collisionLayer;
  }

  get interactableObjects(): Record<InteractionType, Phaser.GameObjects.Group> {
    return this.#interactableObjects;
  }

  get movableObjects(): Phaser.GameObjects.Group {
    return this.#movableObjects;
  }

  get playerSpawnLocation(): tiled.Player {
    return this.#playerSpawnLocation;
  }

  private create(): void {
    this.#interactableObjects = {
      action: this.host.add.group([]),
    };
    this.#movableObjects = this.host.add.group([]);
    this.#chunks = new Map();
    this.map = this.host.make.tilemap({ key: getAreaMap(this.area) });
    this.createImageLayers();
    this.createCollisionLayer();
    this.createChunks();
  }

  private createImageLayers(): void {
    AreaComponent.ImageLayers.forEach((layerTypeKey) => {
      this.host.add
        .image(0, 0, getAreaImage(this.area, ImageType[layerTypeKey]), 0)
        .setOrigin(0)
        .setDepth(Depth[layerTypeKey]);
    });
  }

  private createCollisionLayer(): void {
    const collisionTiles = this.map.addTilesetImage(
      getAreaTileset(this.area, TilesetType.Collision),
      getAreaImage(this.area, ImageType.Collision)
    );
    if (!collisionTiles) {
      throw new Error("Error while creating collision tileset!");
    }

    const collisionLayer = this.map.createLayer(getAreaLayer(this.area, LayerType.Collision), [collisionTiles], 0, 0);
    if (!collisionLayer) {
      throw new Error("Error while creating collision layer!");
    }

    this.#collisionLayer = collisionLayer.setDepth(Depth.Collision).setAlpha(0.3);
    this.#collisionLayer.setCollision([collisionLayer.tileset[0].firstgid]);
  }

  private createChunks(): void {
    const chunkLayers = tiled.getObjectLayerNames(this.map, tiled.Layer.Chunks).map((layerName) => {
      const [_, id, group, ...rest] = layerName.split(tiled.LayerNameDelimiter);

      return {
        layerName,
        id,
        group,
        rest,
      };
    });

    for (const { id, layerName, group } of chunkLayers) {
      if (!this.#chunks.has(id)) {
        this.#chunks.set(id, {});
      }

      if (group === tiled.Layer.Objects) {
        this.createObjects({ chunkId: id, layerName });
      }
    }
  }

  private createObjects({ layerName }: { chunkId: string; layerName: string }): void {
    const tiledObjects = tiled.getObjectsFromLayer(this.map, layerName);

    for (const tiledObject of tiledObjects) {
      const object = ((tiledObject: tiled.ValidObject) => {
        switch (tiledObject.type) {
          case "Balloon":
            return new Balloon({ scene: this.host, properties: tiledObject });
          case "Player":
            this.#playerSpawnLocation = tiledObject;
            break;
          case "Toilet":
            return new Toilet({ scene: this.host, properties: tiledObject });
          default:
        }
      })(tiledObject);

      object?.setDepth(Depth.Objects);

      if (object?.isInteractable) {
        this.#interactableObjects[object.isInteractable.type].add(object);
      }

      if (object?.isMovable) {
        this.#movableObjects.add(object);
      }
    }
  }
}
