export const ObjectType = {
  Balloon: "Balloon",
  NPC: "NPC",
  Plate: "Plate",
  Player: "Player",
  Toilet: "Toilet",
} as const;

type ObjectTypeKey = keyof typeof ObjectType;
export type ObjectType = (typeof ObjectType)[ObjectTypeKey];

export type Object<T extends ObjectType> = {
  type: T;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ObjectProperty = {
  name: string;
  type: string;
  value: string | number | boolean;
};

export type ObjectWithProperties<T extends ObjectType> = Object<T> & {
  properties?: ObjectProperty[];
};

export const Enum = {
  Color: {
    Blue: "Blue",
    Green: "Green",
    Red: "Red",
    Yellow: "Yellow",
  },
  NpcType: {
    Dog: "Dog",
    Tobias: "Tobias",
    Cynthia: "Cynthia",
    Neightbor: "Neighbor",
    Amelie: "Amelie",
    Thief: "Thief",
  },
} as const;

export type Color = (typeof Enum.Color)[keyof typeof Enum.Color];
export type NpcType = (typeof Enum.NpcType)[keyof typeof Enum.NpcType];

export type Chunk = { id: string };

export type Balloon = Object<typeof ObjectType.Balloon> & {
  type: typeof ObjectType.Balloon;
  properties: {
    color: Color;
  };
};

export type NPC = Object<typeof ObjectType.NPC> & {
  properties: {
    type: NpcType;
  };
};

export type Plate = Object<typeof ObjectType.Plate> & {
  properties: {
    isWithCake: boolean;
  };
};

export type Player = Object<typeof ObjectType.Player>;

export type Toilet = Object<typeof ObjectType.Toilet> & {
  properties: {
    isOpened: boolean;
  };
};

export type ValidObject = Balloon | NPC | Plate | Player | Toilet;

export type ValidObjectMappedByType = {
  Balloon: Balloon;
  NPC: NPC;
  Plate: Plate;
  Player: Player;
  Toilet: Toilet;
};

export const LayerNameDelimiter = "/";

export const Layer = {
  Chunks: "chunks",
  Objects: "objects",
} as const;
