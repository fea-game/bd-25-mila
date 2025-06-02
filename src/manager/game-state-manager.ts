import { Area, Direction } from "../common/types";
import { load, save } from "../common/utils";
import { PersistableProperties } from "../components/game-object/common/persistable-component";
import { NpcType } from "../game-objects/characters/npc";
import { PlayerType } from "../game-objects/characters/player/player";

export interface GameState {
  area: Area;
  character: CharacterState;
  scene: SceneState;
  [Area.House]: HouseState;
}

export class GameStateManager implements GameState {
  public static get instance() {
    if (!GameStateManager.#instance) {
      GameStateManager.#instance = new GameStateManager();
    }

    return GameStateManager.#instance;
  }

  static #instance: GameStateManager;

  private static EmptyState = {
    area: Area.House,
    character: {},
    scene: {
      current: null,
      finished: [],
    },
    [Area.House]: {
      wokeUp: false,
      wentToLivingRoom: false,
      sisterMoved: false,
      happyBirthdaySung: false,
      objects: {},
    } satisfies HouseState,
  } satisfies Record<keyof GameState, GameState[keyof GameState]>;

  private static StorageKey = "bd-25-game-state";

  #state: GameState;

  constructor() {
    const initial = this.getInitialState();

    this.#state = {
      area: initial.area,
      character: initial.character,
      scene: initial.scene,
      [Area.House]: initial.house,
    };
  }

  public get area() {
    return this.#state.area;
  }

  public get character() {
    return this.#state.character;
  }

  public get scene() {
    return this.#state.scene;
  }

  public get house() {
    return this.#state.house;
  }

  public getAreaState(area: Area): AreaState {
    return this.#state[area];
  }

  public persist() {
    const error = save(GameStateManager.StorageKey, this.#state);

    if (error) {
      console.error("Error while save state!", { error, state: this.#state });
    }
  }

  private getInitialState(): GameState {
    const stored = load(GameStateManager.StorageKey, toGameState);

    return stored ?? GameStateManager.EmptyState;
  }
}

type CharacterState = Partial<Record<NpcType | PlayerType, { id: string; x: number; y: number; direction: Direction }>>;

type SceneState = {
  current: string | null;
  finished: string[];
};

type AreaState = {
  objects: Record<string, PersistableProperties>;
};

type HouseState = AreaState & {
  wokeUp: boolean;
  wentToLivingRoom: boolean;
  sisterMoved: boolean;
  happyBirthdaySung: boolean;
};

function toGameState(value: unknown): GameState | undefined {
  try {
    assertIsGameState(value);

    return value;
  } catch (e) {
    console.error(e, value);
  }
}

function assertIsGameState(value: unknown): asserts value is GameState {
  if (!value) throw new Error("GameState is not present!");
  if (typeof value !== "object") throw new Error("GameState is no object!");
  if (!("area" in value) || typeof value.area !== "string") throw new Error("GameState doesn't containe area!");
  if (!("character" in value)) throw new Error("GameState doesn't containe character state!");
  if (!("scene" in value)) throw new Error("GameState doesn't containe scene state!");
  if (!("house" in value)) throw new Error("GameState doesn't containe house state!");

  assertIsCharacterState(value.character);
  assertIsSceneState(value.scene);
  assertIsHouseState(value.house);
}

function assertIsCharacterState(value: unknown): asserts value is CharacterState {
  if (!value) throw new Error("CharacterState is not present!");
  if (typeof value !== "object") throw new Error("CharacterState is no object!");

  for (const character of ["Amelie", "Cynthia", "Mila", "Tobias"]) {
    if (!(character in value)) continue;

    if (!value[character]) throw new Error(`CharacterState.${character} is not present!`);
    if (typeof value[character] !== "object") throw new Error(`CharacterState.${character} is not an object!`);
    if (!("id" in value[character])) throw new Error(`CharacterState.${character} does't contain id!`);
    if (typeof value[character].id !== "string") throw new Error(`CharacterState.${character}.id is no string!`);
    if (!("x" in value[character])) throw new Error(`CharacterState.${character} does't contain x!`);
    if (typeof value[character].x !== "number") throw new Error(`CharacterState.${character}.x is no number!`);
    if (!("y" in value[character])) throw new Error(`CharacterState.${character} does't contain y!`);
    if (typeof value[character].y !== "number") throw new Error(`CharacterState.${character}.y is no number!`);
    if (!("direction" in value[character])) throw new Error(`CharacterState.${character} does't contain direction!`);
    if (typeof value[character].direction !== "string")
      throw new Error(`CharacterState.${character}.direction is no string!`);
  }
}

function assertIsSceneState(value: unknown): asserts value is SceneState {
  if (!value) throw new Error("SceneState is not present!");
  if (typeof value !== "object") throw new Error("SceneState is no object!");
  if (!("current" in value)) throw new Error("SceneState doesn't contain current!");
  if (!("finished" in value) || !Array.isArray(value.finished)) throw new Error("SceneState doesn't contain finished!");
  if (value.finished.length > 0 && typeof value.current !== "string")
    throw new Error("SceneState has finished scenes, but no current scene!");
  if (typeof value.current !== "string" && value.current !== null) throw new Error("SceneState.current is invalid!");
}

function assertIsHouseState(value: unknown): asserts value is HouseState {
  if (!value) throw new Error("HouseState is not present!");
  if (typeof value !== "object") throw new Error("HouseState is no object!");
  if (!("wokeUp" in value) || typeof value.wokeUp !== "boolean")
    throw new Error("HouseState doesn't contain valid wokeUp!");
  if (!("wentToLivingRoom" in value) || typeof value.wentToLivingRoom !== "boolean")
    throw new Error("HouseState doesn't contain valid wentToLivingRoom!");
  if (!("sisterMoved" in value) || typeof value.sisterMoved !== "boolean")
    throw new Error("HouseState doesn't contain valid sisterMoved!");
  if (!("happyBirthdaySung" in value) || typeof value.happyBirthdaySung !== "boolean")
    throw new Error("HouseState doesn't contain valid happyBirthdaySung!");
  if (!("objects" in value) || typeof value.objects !== "object" || !value.objects)
    throw new Error("HouseState doesn't contain valid objects!");
}
