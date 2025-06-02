import Phaser from "phaser";
import {
  Balloon,
  Color,
  Enum,
  Foreground,
  LayerNameDelimiter,
  NPC,
  NpcType,
  ValidObjectMappedByType,
  ObjectType,
  Plate,
  Player,
  Toilet,
  ValidObject,
  ObjectWithProperties,
  Layer,
  Trigger,
  TriggerCause,
} from "./types";

/**
 * Parses the provided Phaser Tilemap and returns all Object layer names with the provided prefix.
 * This function expects the layer names to be in a format like: rooms/1/enemies.
 */
export function getObjectLayerNames(
  map: Phaser.Tilemaps.Tilemap,
  opts: { prefix?: string; minDepth?: number } = {}
): string[] {
  const objectLayerNames = map.getObjectLayerNames();

  const { prefix, minDepth = 2 } = opts;

  if (!prefix) return objectLayerNames;

  return objectLayerNames.filter(
    (layerName) =>
      layerName.startsWith(`${prefix}${LayerNameDelimiter}`) && layerName.split(LayerNameDelimiter).length > minDepth
  );
}

const colorValues: string[] = Object.values(Enum.Color);
const npcTypeValues: string[] = Object.values(Enum.NpcType);
const triggerCauseValues: string[] = Object.values(Enum.TriggerCause);

const EnumValidator = {
  isColor: (value: unknown): value is Color => typeof value === "string" && colorValues.includes(value),
  isNpcType: (value: unknown): value is NpcType => typeof value === "string" && npcTypeValues.includes(value),
  isTriggerCause: (value: unknown): value is TriggerCause =>
    typeof value === "string" && triggerCauseValues.includes(value),
};

const ObjectMapper = {
  Balloon: ({
    type,
    x,
    y,
    width,
    height,
    properties,
  }: Phaser.Types.Tilemaps.TiledObject & ObjectWithProperties<"Balloon">): Balloon | undefined => {
    const id = properties?.find((prop) => prop.name === "id")?.value;

    if (typeof id !== "string") {
      console.error("Balloon doesnt have a valid id", { type, id, properties });
      return;
    }

    const color = properties?.find((prop) => prop.name === "color")?.value;

    if (!EnumValidator.isColor(color)) {
      console.error("Balloon doesnt have a valid color", { type, color, properties });
      return;
    }

    return {
      type,
      x,
      y,
      width,
      height,
      properties: { id, color },
    };
  },
  Foreground: (
    { type, x, y, width, height, gid }: Phaser.Types.Tilemaps.TiledObject & ObjectWithProperties<"Foreground">,
    map: Phaser.Tilemaps.Tilemap,
    areaName: string
  ): Foreground => {
    const imageForGid = map.imageCollections
      .find(({ name }) => name === Layer.Foreground)
      ?.images.find((image) => gid === image.gid).image;

    const texture = imageForGid
      ? `${areaName}-${imageForGid.replace(LayerNameDelimiter, "-").replace(".png", "")}`
      : "";

    return {
      type,
      x,
      y,
      width,
      height,
      properties: {
        texture,
      },
    };
  },
  NPC: ({
    type,
    x,
    y,
    width,
    height,
    properties,
  }: Phaser.Types.Tilemaps.TiledObject & ObjectWithProperties<"NPC">): NPC | undefined => {
    const id = properties?.find((prop) => prop.name === "id")?.value;

    if (typeof id !== "string") {
      console.error("NPC doesnt have a valid id", { type, id, properties });
      return;
    }

    const npcType = properties.find((prop) => prop.name === "type")?.value;

    if (!properties || !EnumValidator.isNpcType(npcType)) {
      console.error("NPC doesnt have a valid type", { type, npcType, properties });
      return;
    }

    return {
      type,
      x,
      y,
      width,
      height,
      properties: { id, type: npcType },
    };
  },
  Plate: ({
    type,
    x,
    y,
    width,
    height,
    properties,
  }: Phaser.Types.Tilemaps.TiledObject & ObjectWithProperties<"Plate">): Plate | undefined => {
    const id = properties?.find((prop) => prop.name === "id")?.value;

    if (typeof id !== "string") {
      console.error("Plate doesnt have a valid id", { type, id, properties });
      return;
    }

    const isWithCake = properties.find((prop) => prop.name === "isWithCake")?.value;

    return {
      type,
      x,
      y,
      width,
      height,
      properties: {
        id,
        isWithCake: isWithCake ?? false,
      },
    };
  },
  Player: ({
    type,
    x,
    y,
    width,
    height,
    properties,
  }: Phaser.Types.Tilemaps.TiledObject & ObjectWithProperties<"Player">): Player | undefined => {
    const id = properties?.find((prop) => prop.name === "id")?.value;

    if (typeof id !== "string") {
      console.error("Player doesnt have a valid id", { type, id, properties });
      return;
    }

    return {
      type,
      x,
      y,
      width,
      height,
      properties: { id },
    };
  },
  Toilet: ({
    type,
    x,
    y,
    width,
    height,
    properties,
  }: Phaser.Types.Tilemaps.TiledObject & ObjectWithProperties<"Toilet">): Toilet | undefined => {
    const id = properties?.find((prop) => prop.name === "id")?.value;

    if (typeof id !== "string") {
      console.error("Toilet doesnt have a valid id", { type, id, properties });
      return;
    }

    const isOpened = properties.find((prop) => prop.name === "isOpened")?.value;

    return {
      type,
      x,
      y,
      width,
      height,
      properties: {
        id,
        isOpened: isOpened ?? true,
      },
    };
  },
  Trigger: ({
    type,
    x,
    y,
    width,
    height,
    properties,
  }: Phaser.Types.Tilemaps.TiledObject & ObjectWithProperties<"Trigger">): Trigger => {
    const cause = properties.find((prop) => prop.name === "cause")?.value ?? Enum.TriggerCause.Overlap;
    const id = properties.find((prop) => prop.name === "id")?.value;

    if (!EnumValidator.isTriggerCause(cause)) {
      throw new Error(`Invalid type ${typeof cause} (${cause}) on Trigger.cause!`);
    }
    if (typeof id !== "string") {
      throw new Error(`Invalid type ${typeof id} (${id}) on Trigger.id!`);
    }

    return {
      type,
      x,
      y,
      width,
      height,
      properties: {
        cause,
        id,
      },
    };
  },
} as const satisfies {
  [T in ObjectType]: (
    tiledObject: Phaser.Types.Tilemaps.TiledObject & ObjectWithProperties<T>,
    map: Phaser.Tilemaps.Tilemap,
    areaName: string
  ) => ValidObjectMappedByType[T] | undefined;
};

/**
 * Finds all of the Tiled Objects for a given layer of a Tilemap, and filters to only objects that include
 * the basic properties for an objects position, width, and height.
 */
export function getObjectsFromLayer(map: Phaser.Tilemaps.Tilemap, layerName: string, areaName: string): ValidObject[] {
  const validTiledObjects: ValidObject[] = [];

  // get the Tiled object layer by its name
  const tiledObjectLayer = map.getObjectLayer(layerName);
  if (!tiledObjectLayer) {
    return validTiledObjects;
  }

  // loop through each object and validate object has basic properties for position, width, height, etc
  for (const tiledObject of tiledObjectLayer.objects) {
    if (!isAccepted(tiledObject)) continue;

    const validObject = ObjectMapper[tiledObject.type](
      // @ts-expect-error (ts-2345) Because tiledObject is narrowed TiledObject & ObjectWithProperties<ObjectType>,
      // which is a union of multiple object types. This is never possible — type can’t simultaneously be all those values.
      // So TypeScript collapses the intersection to never.
      tiledObject as Phaser.Types.Tilemaps.TiledObject & ObjectWithProperties<typeof tiledObject.type>,
      map,
      areaName
    );

    if (!validObject) continue;

    validTiledObjects.push(validObject);
  }

  return validTiledObjects;
}

function isAccepted(
  tiledObject: Phaser.Types.Tilemaps.TiledObject
): tiledObject is Phaser.Types.Tilemaps.TiledObject & ObjectWithProperties<ObjectType> {
  if (
    !isObjectType(tiledObject.type) ||
    tiledObject.x === undefined ||
    tiledObject.y === undefined ||
    tiledObject.width === undefined ||
    tiledObject.height === undefined ||
    (tiledObject.properties !== undefined && !Array.isArray(tiledObject.properties))
  ) {
    return false;
  }

  return true;
}

const objectTypes = Object.values(ObjectType);

function isObjectType(value: string): value is ObjectType {
  return objectTypes.includes(value as ObjectType);
}
