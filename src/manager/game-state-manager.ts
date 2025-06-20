import { Area, Direction } from "../common/types";
import { destroy, load, save } from "../common/utils";
import { PersistableProperties } from "../components/game-object/common/persistable-component";
import { NpcType } from "../game-objects/characters/npc";
import { PlayerType } from "../game-objects/characters/player";

export class GameStateManager implements GameState {
  public static get instance() {
    if (!GameStateManager.#instance) {
      GameStateManager.#instance = new GameStateManager();
    }

    return GameStateManager.#instance;
  }

  static #instance: GameStateManager;

  private static getEmptyState() {
    return {
      area: Area.House,
      character: getEmptyCharacterState(),
      dialog: getEmptyDialogState(),
      scene: getEmptySceneState(),
      [Area.House]: getEmptyHouseState(),
    } satisfies Record<keyof GameState, GameState[keyof GameState]>;
  }

  private static StorageKey = "bd-25-game-state";

  #state: GameState;

  constructor() {
    const initial = this.getInitialState();

    this.#state = initial;
  }

  public get area() {
    return this.#state.area;
  }

  public get character() {
    return this.#state.character;
  }

  public get dialog() {
    return this.#state.dialog;
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

  public isDialogFinished(dialogId: string): boolean {
    return this.#state.dialog.finished[dialogId] ?? false;
  }

  public finishDialog(dialogId: string) {
    this.#state.dialog.finished[dialogId] = true;
  }

  public clear() {
    const error = destroy(GameStateManager.StorageKey);

    if (error) {
      console.error("Error while clear state!", { error, state: this.#state });
    }
  }

  public persist() {
    const error = save(GameStateManager.StorageKey, this.#state);

    if (error) {
      console.error("Error while save state!", { error, state: this.#state });
    }
  }

  private getInitialState(): GameState {
    const stored = load(GameStateManager.StorageKey, toGameState);

    return stored ?? GameStateManager.getEmptyState();
  }
}

export interface GameState {
  area: Area;
  character: CharacterState;
  dialog: DialogState;
  scene: SceneState;
  [Area.House]: HouseState;
}

type CharacterState = Partial<Record<NpcType | PlayerType, { id: string; x: number; y: number; direction: Direction }>>;

function getEmptyCharacterState(): CharacterState {
  return {};
}

type DialogState = {
  finished: Record<string, true>;
};

function getEmptyDialogState(): DialogState {
  return {
    finished: {},
  };
}

type SceneState = {
  current: string | null;
  finished: string[];
};

function getEmptySceneState(): SceneState {
  return {
    current: null,
    finished: [],
  };
}

type AreaState = {
  objects: Record<string, PersistableProperties>;
};

type HouseState = AreaState & {
  wokeUp: boolean;
  wentToLivingRoom: boolean;
  sisterMoved: boolean;
  happyBirthdaySung: boolean;
  discoveredCakeIsMissing: boolean;
  numCrumbsDiscovered: number;
  discoveredThief: boolean;
  foodForThiefReceived: boolean;
  obtainedCake: boolean;
  putCakeBack: boolean;
};

function getEmptyHouseState(): HouseState {
  return {
    wokeUp: false,
    wentToLivingRoom: false,
    sisterMoved: false,
    happyBirthdaySung: false,
    discoveredCakeIsMissing: false,
    numCrumbsDiscovered: 0,
    discoveredThief: false,
    foodForThiefReceived: false,
    obtainedCake: false,
    putCakeBack: false,
    objects: {},
  };
}

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
  if (!("area" in value) || typeof value.area !== "string") throw new Error("GameState doesn't contain area!");
  if (!("character" in value)) throw new Error("GameState doesn't contain character state!");
  if (!("dialog" in value)) throw new Error("GameState doesn't contain dialog state!");
  if (!("scene" in value)) throw new Error("GameState doesn't contain scene state!");
  if (!("house" in value)) throw new Error("GameState doesn't contain house state!");

  assertIsCharacterState(value.character);
  assertIsDialogState(value.dialog);
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

function assertIsDialogState(value: unknown): asserts value is DialogState {
  if (!value) throw new Error("DialogState is not present!");
  if (typeof value !== "object") throw new Error("DialogState is no object!");
  if (!("finished" in value) || !value.finished || typeof value.finished !== "object")
    throw new Error("DialogState doesn't contain finished!");
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
  if (!("discoveredCakeIsMissing" in value) || typeof value.discoveredCakeIsMissing !== "boolean")
    throw new Error("HouseState doesn't contain valid discoveredCakeIsMissing!");
  if (!("numCrumbsDiscovered" in value) || typeof value.numCrumbsDiscovered !== "number")
    throw new Error("HouseState doesn't contain valid numCrumbsDiscovered!");
  if (!("discoveredThief" in value) || typeof value.discoveredThief !== "boolean")
    throw new Error("HouseState doesn't contain valid discoveredThief!");
  if (!("foodForThiefReceived" in value) || typeof value.foodForThiefReceived !== "boolean")
    throw new Error("HouseState doesn't contain valid obtainedCake!");
  if (!("obtainedCake" in value) || typeof value.obtainedCake !== "boolean")
    throw new Error("HouseState doesn't contain valid happyBirthdaySung!");
  if (!("putCakeBack" in value) || typeof value.putCakeBack !== "boolean")
    throw new Error("HouseState doesn't contain valid putCakeBack!");
  if (!("objects" in value) || typeof value.objects !== "object" || !value.objects)
    throw new Error("HouseState doesn't contain valid objects!");
}
