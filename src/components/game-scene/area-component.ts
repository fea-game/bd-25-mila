import Phaser from "phaser";
import { getAreaImage, getAreaMap, getAreaTileset, ImageType, TilesetType } from "../../common/assets";
import { Depth } from "../../common/config";
import { Area, getAreaLayer, InteractionType, LayerType, LayerTypeKey } from "../../common/types";
import GameScene from "../../scenes/game-scene";
import { BaseGameSceneComponent } from "./base-game-scene-component";
import * as tiled from "../../tiled";
import { Balloon } from "../../game-objects/objects/balloon";
import { Toilet } from "../../game-objects/objects/toilet";
import { Npc } from "../../game-objects/characters/npc";
import { InputComponent } from "../input/input-component";
import { Plate } from "../../game-objects/objects/plate";
import { Foreground } from "../../game-objects/objects/foreground";

export class AreaComponent extends BaseGameSceneComponent {
  private static ImageLayers: Array<LayerTypeKey> = ["Background"];

  private area: Area;
  private map: Phaser.Tilemaps.Tilemap;
  #collisionLayer: Phaser.GameObjects.Group;
  #foregroundLayer: Phaser.GameObjects.Group;
  #interactableObjects: Record<InteractionType, Phaser.Physics.Arcade.Group>;
  #npcs: Phaser.Physics.Arcade.Group;
  #playerSpawnLocation: tiled.Player;
  #pushableObjects: Phaser.GameObjects.Group;
  #chunks: Map<tiled.Chunk["id"], {}>;

  constructor(host: GameScene, area: Area) {
    super(host);

    this.area = area;
    this.create();
  }

  get collisionLayer(): Phaser.GameObjects.Group {
    return this.#collisionLayer;
  }

  get interactableObjects(): Record<InteractionType, Phaser.Physics.Arcade.Group> {
    return this.#interactableObjects;
  }

  get npcs(): Phaser.Physics.Arcade.Group {
    return this.#npcs;
  }

  get playerSpawnLocation(): tiled.Player {
    return this.#playerSpawnLocation;
  }

  get pushableObjects(): Phaser.GameObjects.Group {
    return this.#pushableObjects;
  }

  private create(): void {
    this.#collisionLayer = this.host.add.group([]);
    this.#foregroundLayer = this.host.add.group([]);
    this.#interactableObjects = {
      action: this.host.physics.add.group({ immovable: true, allowGravity: false }),
    };
    this.#npcs = this.host.physics.add.group({ immovable: true, allowGravity: false });
    this.#pushableObjects = this.host.add.group([]);
    this.#chunks = new Map();
    this.map = this.host.make.tilemap({ key: getAreaMap(this.area) });
    this.createImageLayers();
    this.createForeground();
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

    collisionLayer.setDepth(Depth.Collision).setAlpha(0.3).setCollision([collisionLayer.tileset[0].firstgid]);

    this.#collisionLayer.add(collisionLayer);
  }

  private createForeground() {
    const foregroundLayers = tiled.getObjectLayerNames(this.map, { prefix: tiled.Layer.Foreground, minDepth: 1 });

    for (const layer of foregroundLayers) {
      const objects = tiled.getObjectsFromLayer(this.map, layer, this.area);

      for (const object of objects) {
        if (object.type === "Foreground") {
          this.#foregroundLayer.add(new Foreground({ scene: this.host, properties: object }));
        }
      }
    }
  }

  private createChunks(): void {
    const chunkLayers = tiled
      .getObjectLayerNames(this.map, { prefix: tiled.Layer.Chunks, minDepth: 2 })
      .map((layerName) => {
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
    const tiledObjects = tiled.getObjectsFromLayer(this.map, layerName, this.area);

    for (const tiledObject of tiledObjects) {
      const object = ((tiledObject: tiled.ValidObject) => {
        switch (tiledObject.type) {
          case "Balloon":
            return new Balloon({ scene: this.host, properties: tiledObject });
          case "NPC":
            return new Npc({ scene: this.host, input: new InputComponent(), properties: tiledObject });
          case "Plate":
            return new Plate({ scene: this.host, properties: tiledObject });
          case "Player":
            this.#playerSpawnLocation = tiledObject;
            break;
          case "Toilet":
            return new Toilet({ scene: this.host, properties: tiledObject });
          default:
        }
      })(tiledObject);

      if (object instanceof Npc) {
        this.#npcs.add(object);
        this.#collisionLayer.add(object);
      }

      if (object?.isInteractable) {
        this.#interactableObjects[object.isInteractable.type].add(object.isInteractable.trigger);
        this.#collisionLayer.add(object);
      }

      if (object?.isPushable) {
        this.#pushableObjects.add(object);
      }
    }
  }
}
