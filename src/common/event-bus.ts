import * as Phaser from "phaser";
import { GameObject } from "./types";
import { Contactable } from "../components/game-object/object/contactable-component";
import { Actionable } from "../components/game-object/object/actionable-component";
import { Actor } from "../components/game-object/character/action-component";

export class EventBus extends Phaser.Events.EventEmitter {
  public static readonly Event = {
    Acted: "acted",
    Contacted: "contacted",
  } as const;

  public static readonly instance: EventBus = new EventBus();

  public static getSubject(event: Event, ...tokens: string[]): string {
    return EventBus.buildSubject(event, ...tokens);
  }

  private static buildSubject(...tokens: string[]): string {
    return tokens.join("-");
  }

  public static acted(payload: EventPayload[typeof EventBus.Event.Acted]): void {
    EventBus.emit(payload, this.Event.Acted, payload.interactedWith.isInteractable.id);
  }

  public static contacted(payload: EventPayload[typeof EventBus.Event.Contacted]): void {
    EventBus.emit(payload, this.Event.Contacted, payload.interactedWith.isInteractable.id);
  }

  private static emit(payload: any, event: Event, ...tokens: string[]): void {
    const channels = [event, ...tokens].reduce((channels: string[], subject: string) => {
      const previous = channels.at(-1);

      channels.push(previous ? EventBus.buildSubject(previous, subject) : subject);

      return channels;
    }, new Array<string>());

    for (const channel of channels) {
      EventBus.instance.emit(channel, payload);
    }
  }
}

type Event = (typeof EventBus.Event)[keyof typeof EventBus.Event];

export type EventPayload = {
  [EventBus.Event.Acted]: { actor: Actor; interactedWith: Actionable };
  [EventBus.Event.Contacted]: { actor: GameObject; interactedWith: Contactable };
};
