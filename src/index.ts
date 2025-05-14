import "phaser";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

function preload() {
  // Load assets here if needed
}

function create() {
  const text = this.add.text(400, 300, "Hello, Phaser!", {
    fontSize: "32px",
    fill: "#ffffff"
  });
  text.setOrigin(0.5, 0.5); // Center the text
}

function update() {
  // Update game logic here
}
