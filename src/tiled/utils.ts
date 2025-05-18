import Phaser from "phaser";
import {
  Balloon,
  Color,
  Enum,
  LayerNameDelimiter,
  NPC,
  NpcType,
  type Object,
  ValidObjectMappedByType,
  ObjectProperty,
  ObjectType,
  Plate,
  Player,
  Toilet,
  ValidObject,
  ObjectWithProperties,
} from "./types";

/**
 * Parses the provided Phaser Tilemap and returns all Object layer names with the provided prefix.
 * This function expects the layer names to be in a format like: rooms/1/enemies.
 */
export function getObjectLayerNames(map: Phaser.Tilemaps.Tilemap, prefix?: string): string[] {
  const objectLayerNames = map.getObjectLayerNames();

  if (!prefix) return objectLayerNames;

  return objectLayerNames.filter(
    (layerName) =>
      layerName.startsWith(`${prefix}${LayerNameDelimiter}`) && layerName.split(LayerNameDelimiter).length > 2
  );
}

const colorValues: string[] = Object.values(Enum.Color);
const npcTypeValues: string[] = Object.values(Enum.NpcType);

const EnumValidator = {
  isColor: (value: unknown): value is Color => typeof value === "string" && colorValues.includes(value),
  isNpcType: (value: unknown): value is NpcType => typeof value === "string" && npcTypeValues.includes(value),
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
      properties: { color },
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
      properties: { type: npcType },
    };
  },
  Plate: ({
    type,
    x,
    y,
    width,
    height,
    properties,
  }: Phaser.Types.Tilemaps.TiledObject & ObjectWithProperties<"Plate">): Plate => {
    const isWithCake = properties.find((prop) => prop.name === "isWithCake")?.value;

    return {
      type,
      x,
      y,
      width,
      height,
      properties: {
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
  }: Phaser.Types.Tilemaps.TiledObject & ObjectWithProperties<"Player">): Player => {
    return {
      type,
      x,
      y,
      width,
      height,
    };
  },
  Toilet: ({
    type,
    x,
    y,
    width,
    height,
    properties,
  }: Phaser.Types.Tilemaps.TiledObject & ObjectWithProperties<"Toilet">): Toilet => {
    const isOpened = properties.find((prop) => prop.name === "isOpened")?.value;

    return {
      type,
      x,
      y,
      width,
      height,
      properties: {
        isOpened: isOpened ?? true,
      },
    };
  },
} as const satisfies {
  [T in ObjectType]: (
    tiledObject: Phaser.Types.Tilemaps.TiledObject & ObjectWithProperties<T>
  ) => ValidObjectMappedByType[T] | undefined;
};

/**
 * Finds all of the Tiled Objects for a given layer of a Tilemap, and filters to only objects that include
 * the basic properties for an objects position, width, and height.
 */
export function getObjectsFromLayer(map: Phaser.Tilemaps.Tilemap, layerName: string): ValidObject[] {
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
      tiledObject as Phaser.Types.Tilemaps.TiledObject & ObjectWithProperties<typeof tiledObject.type>
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

/**
 * Returns an array of validated TiledObjectProperty objects from the provided Phaser Tiled Object properties.
 */
function getProperties(properties: unknown): ObjectProperty[] {
  const validProperties: ObjectProperty[] = [];
  if (typeof properties !== "object" || properties === null || properties === undefined || !Array.isArray(properties)) {
    return validProperties;
  }

  for (const property of properties) {
    if (!isProperty(property)) {
      continue;
    }
    validProperties.push(property);
  }

  return validProperties;
}

/**
 * Validates that the provided property is of the type TiledObjectProperty.
 */
function isProperty(property: unknown): property is ObjectProperty {
  if (typeof property !== "object" || property === null || property === undefined) {
    return false;
  }
  return property["name"] !== undefined && property["type"] !== undefined && property["value"] !== undefined;
}
