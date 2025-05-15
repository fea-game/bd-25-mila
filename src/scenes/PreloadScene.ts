import Phaser from "phaser";
import { SceneKey } from "../common/types";
import { Animation, SpriteAtlas } from "../common/assets";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: SceneKey.Preload });
  }

  preload() {
    for (const [key, { textureUrl, atlasUrl }] of Object.entries(SpriteAtlas)) {
      this.load.atlas(key, textureUrl, atlasUrl);
    }

    for (const [key, { url }] of Object.entries(Animation)) {
      this.load.animation(key, url);
    }
  }

  create() {
    this.scene.start(SceneKey.Game);
  }
}
