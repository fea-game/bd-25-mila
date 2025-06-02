import { GameObject } from "../../../common/types";
import { BaseGameObjectComponent } from "../base-game-object-component";

export type PersistableProperties = Record<string | number, any> & { id: string };

type Config<TProperties extends PersistableProperties> = {
  host: GameObject;
  toPersistenceProperties(): TProperties;
};

export class PersistableComponent<TProperties extends PersistableProperties> extends BaseGameObjectComponent {
  public readonly toPersistenceProperties: () => TProperties;

  constructor(config: Config<TProperties>) {
    super(config.host);

    this.toPersistenceProperties = config.toPersistenceProperties;
  }
}

export interface Persistable<TProperties extends PersistableProperties> {
  isPersistable: PersistableComponent<TProperties>;
}

export function isPersistable<T, TProperties extends PersistableProperties>(
  object: T
): object is T & Persistable<TProperties> {
  if (!object) return false;
  if (typeof object !== "object") return false;
  if (!("isPersistable" in object)) return false;
  if (typeof object.isPersistable !== "object") return false;

  return object.isPersistable instanceof PersistableComponent;
}
