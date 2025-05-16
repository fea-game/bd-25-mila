import Phaser from "phaser";
import { SceneKey } from "../common/types";
import { Animation } from "../common/assets";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKey.Preload });
  }

  preload() {
    this.load.pack("main", "assets/data/assets.json");
    for (const [key, { url }] of Object.entries(Animation)) {
      //this.load.animation(key, url);
    }
  }

  create() {
    this.createAnimations();

    this.scene.start(SceneKey.Game);
  }

  private createAnimations() {
    this.anims.createFromAseprite("character");

    /*
    this.anims.create({
      key: "player-idle-down",
      frames: [{ key: "character", frame: "player_idle_down_0" }],
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "player-walk-down",
      frames: [
        { key: "character", frame: "player_walk_down_0" },
        { key: "character", frame: "player_walk_down_1" },
        { key: "character", frame: "player_walk_down_0" },
        { key: "character", frame: "player_walk_down_2" },
      ],
      frameRate: 6,
      repeat: -1,
    });
    */
  }
}
