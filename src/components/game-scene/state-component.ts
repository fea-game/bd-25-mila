import GameScene from "../../scenes/game-scene";
import { BaseGameSceneComponent } from "./base-game-scene-component";
import { Area } from "../../common/types";

export class StateComponent extends BaseGameSceneComponent {
  #state = {
    [Area.House]: new HouseState(),
  };

  constructor(host: GameScene) {
    super(host);
  }

  public get house() {
    return this.#state.house;
  }
}

export type GameState = {
  [Area.House]: HouseState;
};

export class HouseState {
  #wokeUp = false;
  #wentToLivingRoom = false;
  #sisterMoved = false;

  get wokeUp() {
    return this.#wokeUp;
  }
  set wokeUp(value: boolean) {
    this.#wokeUp = value;
  }

  get wentToLivingRoom() {
    return this.#wentToLivingRoom;
  }
  set wentToLivingRoom(value: boolean) {
    this.#wentToLivingRoom = value;
  }

  get sisterMoved() {
    return this.#sisterMoved;
  }
  set sisterMoved(value: boolean) {
    this.#sisterMoved = value;
  }
}
