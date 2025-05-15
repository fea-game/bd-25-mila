export class InputComponent {
  #up: boolean;
  #down: boolean;
  #left: boolean;
  #right: boolean;
  #actionKey: boolean;
  #isMovementLocked: boolean;

  constructor() {
    this.#up = false;
    this.#down = false;
    this.#left = false;
    this.#right = false;
    this.#actionKey = false;
    this.#isMovementLocked = false;
  }

  get isUpDown(): boolean {
    return this.#up;
  }
  set isUpDown(val: boolean) {
    this.#up = val;
  }
  get isUpJustDown(): boolean {
    return this.#up;
  }

  get isDownDown(): boolean {
    return this.#down;
  }
  get isDownJustDown(): boolean {
    return this.#down;
  }
  set isDownDown(val: boolean) {
    this.#down = val;
  }

  get isLeftDown(): boolean {
    return this.#left;
  }
  set isLeftDown(val: boolean) {
    this.#left = val;
  }

  get isRightDown(): boolean {
    return this.#right;
  }
  set isRightDown(val: boolean) {
    this.#right = val;
  }

  get isActionKeyJustDown(): boolean {
    return this.#actionKey;
  }
  set isActionKeyJustDown(val: boolean) {
    this.#actionKey = val;
  }

  get isMovementLocked(): boolean {
    return this.#isMovementLocked;
  }
  set isMovementLocked(val: boolean) {
    this.#isMovementLocked = val;
  }

  get isNoMovement(): boolean {
    return (
      this.isMovementLocked ||
      (!this.isDownDown &&
        !this.isUpDown &&
        !this.isLeftDown &&
        !this.isRightDown)
    );
  }

  public reset(): void {
    this.#up = false;
    this.#down = false;
    this.#left = false;
    this.#right = false;
    this.#actionKey = false;
    this.#isMovementLocked = false;
  }
}
