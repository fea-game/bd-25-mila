import * as Phaser from "phaser";
import { GameObject } from "./types";
import { Interactable } from "../game-objects/types";

export class EventBus {
  public static readonly Event = {
    Interacted: "interacted",
  } as const;

  public static readonly instance: EventBus = new EventBus();

  #emitter: Phaser.Events.EventEmitter;

  constructor() {
    this.#emitter = new Phaser.Events.EventEmitter();
  }

  public emit(...event: Event): void {
    this.#emitter.emit(...event);
  }

  public on(event: Event[0], onEvent: Function, context?: any): void {
    this.#emitter.on(event, onEvent, context);
  }

  public once(event: Event[0], onEvent: Function, context?: any): void {
    this.#emitter.once(event, onEvent, context);
  }

  public off(event: Event[0], onEvent?: Function, context?: any, isOnce?: boolean): void {
    this.#emitter.off(event, onEvent, context, isOnce);
  }
}

type EventPayload = {
  [EventBus.Event.Interacted]: { actor: GameObject; interactedWith: Interactable };
};

type Event = {
  [K in keyof EventPayload]: [K, EventPayload[K]];
}[keyof EventPayload];
