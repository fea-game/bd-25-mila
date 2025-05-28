import { Objects } from "../components/game-scene/objects-component";
import { Npc, NpcType } from "../game-objects/characters/npc";

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

type Npcs = Record<NpcType, Npc>;

export function getNpcs(objects: Objects): Partial<Npcs> {
  return objects.npc.getChildren().reduce((npcs: Partial<Npcs>, npc) => {
    if (!(npc instanceof Npc)) return npcs;

    npcs[npc.characterType] = npc;

    return npcs;
  }, {});
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
