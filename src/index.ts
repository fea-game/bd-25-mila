import "phaser";
import PreloadScene from "./scenes/PreloadScene";
import GameScene from "./scenes/GameScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  backgroundColor: "#000000",
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: true,
    },
  },
  scale: {
    parent: "game-container",
    width: 768,
    height: 672,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT,
  },
  scene: [PreloadScene, GameScene],
};

const game = new Phaser.Game(config);
