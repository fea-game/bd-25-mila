import "phaser";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  pixelArt: true,
  roundPixels: true,
  scale: {
    parent: 'game-container',
    width: 256,
    height: 224,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT,
  },
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: true,
    },
  },
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

function preload() {
  // Load assets here if needed
}

function create() {
  const text = this.add.text(Number(game.config.width) / 2, Number(game.config.height) / 2, "Hello, Phaser!", {
    fontSize: "16px",
    fill: "#ffffff"
  });
  text.setOrigin(0.5, 0.5); // Center the text
}

function update() {
  // Update game logic here
}
