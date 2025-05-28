import { Area } from "../common/types";
import { createReactiveState, load, getNpcs, save } from "../common/utils";
import { NpcType } from "../game-objects/characters/npc";
import { PlayerType } from "../game-objects/characters/player/player";

export interface GameState {
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
    } satisfies HouseState,
  } satisfies Record<keyof GameState, GameState[keyof GameState]>;

  private static StorageKey = "bd-25-game-state";

  #state: GameState;

  constructor() {
    const initial = this.getInitialState();

    this.#state = {
      character: initial.character,
      scene: createReactiveState(initial.scene, this.onChange.bind(this)),
      [Area.House]: initial.house,
    };
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

  private getInitialState(): GameState {
    const stored = load(GameStateManager.StorageKey, toGameState);

    return stored ?? GameStateManager.EmptyState;
  }

  private onChange(key: number | string | symbol, value: any): void {
    const error = save(GameStateManager.StorageKey, this.#state);

    if (error) {
      console.error("Error while save state!", { [key]: value, error });
    }
  }
}

type CharacterState = Partial<Record<NpcType | PlayerType, { x: number; y: number }>>;

type SceneState = {
  current: string | null;
  finished: string[];
};

type HouseState = {
  wokeUp: boolean;
  wentToLivingRoom: boolean;
  sisterMoved: boolean;
  happyBirthdaySung: boolean;
};

function toGameState(value: unknown): GameState | undefined {
  if (!isGameState(value)) return;

  return value;
}

function isGameState(value: unknown): value is GameState {
  if (!value) return false;
  if (typeof value !== "object") return false;
  if (!("character" in value) || typeof value.character !== "object") return false;
  if (!isCharacterState(value.character)) return false;
  if (!("scene" in value) || typeof value.scene !== "object") return false;
  if (!isSceneState(value.scene)) return false;
  if (!("house" in value) || typeof value.house !== "object") return false;
  if (!isHouseState(value.house)) return false;

  return true;
}

function isCharacterState(value: unknown): value is CharacterState {
  if (!value) return false;
  if (typeof value !== "object") return false;

  for (const character of ["Amelie", "Cynthia", "Mila", "Tobias"]) {
    if (!(character in value)) continue;

    if (!value[character]) return false;
    if (typeof value[character] !== "object") return false;
    if (!("x" in value[character])) return false;
    if (typeof value[character].x !== "number") return false;
    if (!("y" in value[character])) return false;
    if (typeof value[character].y !== "number") return false;
  }
  return true;
}

function isSceneState(value: unknown): value is SceneState {
  if (!value) return false;
  if (typeof value !== "object") return false;
  if (!("current" in value)) return false;
  if (!("finished" in value) || !Array.isArray(value.finished)) return false;
  if (value.finished.length > 0 && typeof value.current !== "string") return false;
  if (typeof value.current !== "string" && value.current !== null) return false;

  return true;
}

function isHouseState(value: unknown): value is HouseState {
  if (!value) return false;
  if (typeof value !== "object") return false;
  if (!("wokeUp" in value) || typeof value.wokeUp !== "boolean") return false;
  if (!("wentToLivingRoom" in value) || typeof value.wentToLivingRoom !== "boolean") return false;
  if (!("sisterMoved" in value) || typeof value.sisterMoved !== "boolean") return false;
  if (!("happyBirthdaySung" in value) || typeof value.happyBirthdaySung !== "boolean") return false;

  return true;
}
