import Phaser from "phaser";

export interface State {
  name: string;
  onEnter?: (args: Array<unknown>) => void;
  onUpdate?: () => void;
}

export class StateMachine {
  #id: string;
  #states: Map<string, State>;
  #currentState: State | undefined;
  #isChangingState: boolean;
  #changingStateQueue: Array<{ state: string; args: Array<unknown> }>;

  constructor(id?: string) {
    this.#id = id ?? Phaser.Math.RND.uuid();
    this.#isChangingState = false;
    this.#changingStateQueue = [];
    this.#currentState = undefined;
    this.#states = new Map();
  }

  public update(): void {
    const queuedState = this.#changingStateQueue.shift();
    if (queuedState) {
      this.setState(queuedState.state, queuedState.args);
    }

    this.#currentState?.onUpdate?.();
  }

  get id(): string {
    return this.#id;
  }

  get state(): State | undefined {
    return this.#currentState;
  }

  public setState(name: string, ...args: Array<unknown>): void {
    if (!this.#states.has(name)) return;

    if (this.#isCurrentState(name)) return;

    if (this.#isChangingState) {
      this.#changingStateQueue.push({ state: name, args });
      return;
    }

    this.#isChangingState = true;
    this.#currentState = this.#states.get(name);

    this.#currentState?.onEnter?.(args);

    this.#isChangingState = false;
  }

  public addState(state: State): void {
    this.#states.set(state.name, state);
  }

  #isCurrentState(name: string): boolean {
    if (!this.#currentState) return false;

    return this.#currentState.name === name;
  }
}
