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
import { KeyboardComponent } from "../input/keyboard-component";
import { Player } from "../../game-objects/characters/player/player";
import { isActionable } from "../game-object/object/actionable-component";
import { isContactable } from "../game-object/object/contactable-component";
import { isPushable } from "../game-object/object/pushable-component";
import { Trigger } from "../../game-objects/objects/trigger";

export class ObjectsComponent extends BaseGameSceneComponent {
  public static for({
    area,
    host,
    keyboard,
  }: {
    host: GameScene;
    area: Area;
    keyboard: KeyboardComponent;
  }): ObjectsComponent {
    const objects = new ObjectsComponent(host);
    objects.create(area, keyboard);

    return objects;
  }

  private static ImageLayers = ["Background"] satisfies Array<LayerTypeKey>;

  #image: Phaser.GameObjects.Group;
  #collision: Phaser.GameObjects.Group;
  #foreground: Phaser.GameObjects.Group;
  #interactable: Record<InteractionType, Phaser.GameObjects.Group>;
  #npc: Phaser.Physics.Arcade.Group;
  #player: Player;

  constructor(host: GameScene) {
    super(host);
  }

  get collision(): Phaser.GameObjects.Group {
    return this.#collision;
  }

  get interactable(): Record<InteractionType, Phaser.GameObjects.Group> {
    return this.#interactable;
  }

  get npc(): Phaser.Physics.Arcade.Group {
    return this.#npc;
  }

  get player(): Player {
    return this.#player;
  }

  public create(area: Area, keyboard: KeyboardComponent): void {
    this.#image = this.host.add.group([]);
    this.#collision = this.host.add.group([]);
    this.#foreground = this.host.add.group([]);
    this.#interactable = {
      action: this.host.physics.add.group({ immovable: true, allowGravity: false }),
      contact: this.host.add.group([]),
      push: this.host.add.group([]),
    };
    this.#npc = this.host.physics.add.group({ immovable: true, allowGravity: false });

    const map = this.host.make.tilemap({ key: getAreaMap(area) });

    this.createImage(area);
    this.createForeground(area, map);
    this.createCollision(area, map);
    this.createChunks(area, map, keyboard);
  }

  private createImage(area: Area): void {
    ObjectsComponent.ImageLayers.forEach((layerTypeKey) => {
      this.#image.add(
        this.host.add
          .image(0, 0, getAreaImage(area, ImageType[layerTypeKey]), 0)
          .setOrigin(0)
          .setDepth(Depth[layerTypeKey])
      );
    });
  }

  private createForeground(area: Area, map: Phaser.Tilemaps.Tilemap) {
    const foregroundLayers = tiled.getObjectLayerNames(map, { prefix: tiled.Layer.Foreground, minDepth: 1 });

    for (const layer of foregroundLayers) {
      const objects = tiled.getObjectsFromLayer(map, layer, area);

      for (const object of objects) {
        if (object.type === "Foreground") {
          this.#foreground.add(new Foreground({ scene: this.host, properties: object }));
        }
      }
    }
  }

  private createCollision(area: Area, map: Phaser.Tilemaps.Tilemap): void {
    const collisionTiles = map.addTilesetImage(
      getAreaTileset(area, TilesetType.Collision),
      getAreaImage(area, ImageType.Collision)
    );
    if (!collisionTiles) {
      throw new Error("Error while creating collision tileset!");
    }

    const collisionLayer = map.createLayer(getAreaLayer(area, LayerType.Collision), [collisionTiles], 0, 0);
    if (!collisionLayer) {
      throw new Error("Error while creating collision layer!");
    }

    collisionLayer.setDepth(Depth.Collision).setAlpha(0.3).setCollision([collisionLayer.tileset[0].firstgid]);

    this.#collision.add(collisionLayer);
  }

  private createChunks(area: Area, map: Phaser.Tilemaps.Tilemap, keyboard: KeyboardComponent): void {
    const chunkLayers = tiled.getObjectLayerNames(map, { prefix: tiled.Layer.Chunks, minDepth: 2 }).map((layerName) => {
      const [_, id, group, ...rest] = layerName.split(tiled.LayerNameDelimiter);

      return {
        layerName,
        id,
        group,
        rest,
      };
    });

    for (const { id, layerName, group } of chunkLayers) {
      if (group === tiled.Layer.Objects) {
        this.createObjects(layerName, area, map, keyboard);
      }
    }
  }

  private createObjects(layer: string, area: Area, map: Phaser.Tilemaps.Tilemap, keyboard: KeyboardComponent): void {
    const tiledObjects = tiled.getObjectsFromLayer(map, layer, area);

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
            this.#player = new Player({
              scene: this.host,
              input: keyboard,
              properties: tiledObject,
            });
            break;
          case "Toilet":
            return new Toilet({ scene: this.host, properties: tiledObject });
          case "Trigger":
            return new Trigger({ scene: this.host, properties: tiledObject });
          default:
        }
      })(tiledObject);

      if (object instanceof Npc) {
        this.#npc.add(object);
        this.#collision.add(object);
      }

      if (object?.isInteractable) {
        switch (true) {
          case isActionable(object):
            this.#interactable.action.add(object.isInteractable.trigger);
            this.#collision.add(object);
            break;
          case isContactable(object):
            this.#interactable.contact.add(object);
            break;
          case isPushable(object):
            this.#interactable.push.add(object);
            break;
          default:
        }
      }
    }
  }
}
