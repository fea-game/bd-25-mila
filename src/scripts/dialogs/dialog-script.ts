export class DialogScript {
  protected dialogs: Dialog[];

  constructor(dialogs: Dialog[]) {
    this.dialogs = dialogs;
  }

  public current(): Dialog | undefined {
    return this.dialogs.find((dialog) => dialog.isAvailable());
  }

  public get(selector: number | string): Dialog | undefined {
    if (typeof selector === "number") {
      return this.dialogs[selector];
    }

    return this.dialogs.find((dialog) => dialog.id === selector);
  }
}

export type Dialog = {
  readonly id: string;
  readonly text: string;
  isAvailable: () => boolean;
};
