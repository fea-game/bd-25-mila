import { Body, GameObject } from "../../common/types";

export abstract class BaseGameObjectComponent {
  static getFrom<T>(host: GameObject | Body): T {
    return host[`_${this.name}`] as T;
  }

  static removeFrom(host: GameObject | Body): void {
    delete host[`_${this.name}`];
  }

  protected host: GameObject;

  constructor(host: GameObject) {
    this.host = host;
    this.attachTo(host);
  }

  protected attachTo(host: GameObject | Body): void {
    host[`_${this.constructor.name}`] = this;
  }
}
