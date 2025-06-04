import Phaser from "phaser";

export class TextStyle {
  public static new(): TextStyle {
    return new TextStyle();
  }

  private static Base = {
    fontSize: "18px",
    color: "#ffffff",
  };

  #style: Phaser.Types.GameObjects.Text.TextStyle;

  constructor() {
    this.#style = Object.assign({}, TextStyle.Base);
  }

  public add(partial: Phaser.Types.GameObjects.Text.TextStyle): TextStyle {
    Object.assign(this.#style, partial);
    return this;
  }

  public color(color: NonNullable<Phaser.Types.GameObjects.Text.TextStyle["color"]> = TextStyle.Base.color): TextStyle {
    return this.add({ color });
  }

  public size(
    size: NonNullable<Phaser.Types.GameObjects.Text.TextStyle["fontSize"]> = TextStyle.Base.fontSize
  ): TextStyle {
    return this.add({ fontSize: size });
  }

  public withBorder({
    color = "#000000",
    thickness = 4,
  }: {
    color?: Phaser.Types.GameObjects.Text.TextStyle["stroke"];
    thickness?: Phaser.Types.GameObjects.Text.TextStyle["strokeThickness"];
  } = {}): TextStyle {
    return this.add({ stroke: color, strokeThickness: thickness });
  }

  public get(): Phaser.Types.GameObjects.Text.TextStyle {
    return this.#style;
  }
}
