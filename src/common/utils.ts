import { ActionTrigger } from "../components/game-object/object/actionable-component";
import { Objects } from "../components/game-scene/objects-component";
import { Npc, NpcType } from "../game-objects/characters/npc";
import { Crumbs } from "../game-objects/objects/crumbs";
import { Plate } from "../game-objects/objects/plate";

export function createReactiveState<T extends Record<string | symbol | number, unknown>>(
  initial: T,
  onChange: (key: keyof T, value: T[keyof T]) => void
): T {
  return new Proxy(initial, {
    set(target, prop, value) {
      target[prop as keyof T] = value;
      onChange(prop, value);
      return true;
    },
  });
}

export function save<T>(key: string, value: T): undefined | Error {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error while trying to save value!", e, { key, value });

    return e;
  }
}

export function load<T>(key: string, deserialise: (value: string) => T): T | undefined {
  try {
    const stored = window.localStorage.getItem(key);
    if (!stored) {
      console.warn(`No Found: "${key}"!`);
      return;
    }

    const json = JSON.parse(stored);

    return deserialise(json);
  } catch (e) {
    console.error("Error while trying to load value!", e, { key });
    return;
  }
}

export function getCrumbs(objects: Objects): Crumbs[] {
  return objects.interactable.contact.getChildren().filter((object): object is Crumbs => object instanceof Crumbs);
}

type Npcs = Record<NpcType, Npc>;

export function getNpcs(objects: Objects): Partial<Npcs> {
  return objects.npc.getChildren().reduce((npcs: Partial<Npcs>, npc) => {
    if (!(npc instanceof Npc)) return npcs;

    npcs[npc.characterType] = npc;

    return npcs;
  }, {});
}

export function getPlate(objects: Objects): Plate | undefined {
  const plateTrigger = objects.interactable.action
    .getChildren()
    .find((object): object is ActionTrigger & { host: Plate } => {
      if (!("host" in object)) return false;

      return object.host instanceof Plate;
    });

  return plateTrigger?.host;
}

type RequireKeys<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: T[P] };

export function assertNpcsPresent<K extends keyof Npcs>(
  npcs: Partial<Npcs>,
  requiredKeys: K[]
): asserts npcs is RequireKeys<Npcs, K> {
  const missing = requiredKeys.filter((key) => !npcs[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required NPCs: ${missing.join(", ")}`);
  }
}

export function isWithId<T, Ids extends readonly string[]>(value: T, ...ids: Ids): value is T & { id: Ids[number] } {
  if (!value) return false;
  if (typeof value !== "object") return false;
  if (!("id" in value)) return false;
  if (typeof value.id !== "string") return false;
  if (!ids.includes(value.id)) return false;

  return true;
}

export function getDepth(y: number, baseDepth: number): number {
  return baseDepth + y / 10000;
}
