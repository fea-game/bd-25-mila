import GameScene from "../../scenes/game-scene";
import { BaseGameSceneComponent } from "./base-game-scene-component";
import { Area } from "../../common/types";
import { createReactiveState, load, save } from "../../common/utils";

export interface GameState {
  scene: SceneState;
  [Area.House]: HouseState;
}

const InitialState = {
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

export class StateComponent extends BaseGameSceneComponent implements GameState {
  private static StorageKey = "bd-25-game-state";

  #state: GameState;

  constructor(host: GameScene) {
    super(host);

    const stored = load(StateComponent.StorageKey, toGameState);

    console.log("stored", stored);

    this.#state = {
      scene: createReactiveState(stored?.scene ?? InitialState.scene, this.onChange.bind(this)),
      [Area.House]: createReactiveState(stored?.house ?? InitialState[Area.House], this.onChange.bind(this)),
    };

    console.log("STATE", this.#state);
  }

  public get scene() {
    return this.#state.scene;
  }

  public get house() {
    return this.#state.house;
  }

  private onChange(key: number | string | symbol, value: any): void {
    console.log("STATE_CHANGED", { [key]: value }, this.#state);

    save(StateComponent.StorageKey, this.#state);
  }
}

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
  if (!("scene" in value) || typeof value.scene !== "object") return false;
  if (!isSceneState(value.scene)) return false;
  if (!("house" in value) || typeof value.house !== "object") return false;
  if (!isHouseState(value.house)) return false;

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
