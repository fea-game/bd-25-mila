import * as Phaser from "phaser";
import { GameObject } from "./types";
import { Contactable } from "../components/game-object/object/contactable-component";

export class EventBus extends Phaser.Events.EventEmitter {
  public static readonly Event = {
    Contacted: "contacted",
  } as const;

  public static readonly instance: EventBus = new EventBus();

  public static getSubject(event: Event, ...tokens: string[]): string {
    return [event, ...tokens].join("-");
  }

  public static contacted(payload: EventPayload[typeof EventBus.Event.Contacted]): void {
    EventBus.instance.emit(
      EventBus.getSubject(EventBus.Event.Contacted, payload.interactedWith.isInteractable.id),
      payload
    );
  }
}

type Event = (typeof EventBus.Event)[keyof typeof EventBus.Event];

type EventPayload = {
  [EventBus.Event.Contacted]: { actor: GameObject; interactedWith: Contactable };
};
