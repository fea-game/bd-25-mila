export const ObjectType = {
  Balloon: "Balloon",
  Crumbs: "Crumbs",
  Foreground: "Foreground",
  NPC: "NPC",
  Plate: "Plate",
  Player: "Player",
  Toilet: "Toilet",
  Trigger: "Trigger",
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
  CrumbsType: {
    0: 0,
    1: 1,
    2: 2,
  },
  NpcType: {
    Dog: "Dog",
    Tobias: "Tobias",
    Cynthia: "Cynthia",
    Neightbor: "Neighbor",
    Amelie: "Amelie",
    Thief: "Thief",
  },
  TriggerCause: {
    Overlap: "Overlap",
  },
} as const;

export type Color = (typeof Enum.Color)[keyof typeof Enum.Color];
export type CrumbsType = (typeof Enum.CrumbsType)[keyof typeof Enum.CrumbsType];
export type NpcType = (typeof Enum.NpcType)[keyof typeof Enum.NpcType];
export type TriggerCause = (typeof Enum.TriggerCause)[keyof typeof Enum.TriggerCause];

export type Chunk = { id: string };

export type Balloon = Object<typeof ObjectType.Balloon> & {
  properties: {
    id: string;
    color: Color;
  };
};

export type Crumbs = Object<typeof ObjectType.Crumbs> & {
  properties: {
    id: string;
    type: CrumbsType;
  };
};

export type Foreground = Object<typeof ObjectType.Foreground> & {
  properties: {
    texture: string;
  };
};

export type NPC = Object<typeof ObjectType.NPC> & {
  properties: {
    id: string;
    type: NpcType;
  };
};

export type Plate = Object<typeof ObjectType.Plate> & {
  properties: {
    id: string;
    isWithCake: boolean;
  };
};

export type Player = Object<typeof ObjectType.Player> & {
  properties: {
    id: string;
  };
};

export type Toilet = Object<typeof ObjectType.Toilet> & {
  properties: {
    id: string;
    isOpened: boolean;
  };
};

export type Trigger = Object<typeof ObjectType.Trigger> & {
  properties: {
    id: string;
    cause: TriggerCause;
  };
};

export type ValidObject = Balloon | Crumbs | Foreground | NPC | Plate | Player | Toilet | Trigger;

export type ValidObjectMappedByType = {
  Balloon: Balloon;
  Crumbs: Crumbs;
  Foreground: Foreground;
  NPC: NPC;
  Plate: Plate;
  Player: Player;
  Toilet: Toilet;
  Trigger: Trigger;
};

export const LayerNameDelimiter = "/";

export const Layer = {
  Chunks: "chunks",
  Foreground: "foreground",
  Objects: "objects",
} as const;
