import "phaser";
import PreloadScene from "./scenes/preload-scene";
import GameScene from "./scenes/game-scene";
import { isDebugEnabled } from "./common/config";
import controls from "../assets/images/hud/controls.aesprite.json";
import { isMobile, isPortrait } from "./common/utils";

const ControlScale = 4;
const BASE_WIDTH = 768;
const BASE_HEIGHT = 672;

function getConfig(): Phaser.Types.Core.GameConfig {
  const isMobileDevice = isMobile();
  const portrait = isPortrait();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let scaleConfig: Phaser.Types.Core.ScaleConfig;

  if (isMobileDevice) {
    if (portrait) {
      // Portrait: fill width, scale height
      const width = vw;
      const scaleFactor = vw / BASE_WIDTH;
      const height = BASE_HEIGHT * scaleFactor;

      scaleConfig = {
        parent: "game-container",
        width,
        height,
        mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
        autoCenter: Phaser.Scale.NO_CENTER,
      };

      // Ensure canvas sticks to top (can also be done with CSS)
      document.body.style.margin = "0";
      document.body.style.overflow = "hidden";
    } else {
      // Landscape: fill height, scale width
      const height = vh;
      const scaleFactor = vh / BASE_HEIGHT;
      const width = BASE_WIDTH * scaleFactor;

      scaleConfig = {
        parent: "game-container",
        width,
        height,
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
      };
    }
  } else {
    // Desktop
    // Landscape: fill height, scale width
    const height = vh;
    const scaleFactor = vh / BASE_HEIGHT;
    const width = BASE_WIDTH * scaleFactor;

    scaleConfig = {
      parent: "game-container",
      width,
      height,
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    };
  }

  document.documentElement.style.setProperty("--mobile-controls-gap", `${scaleConfig.width}px`);

  return {
    type: Phaser.WEBGL,
    backgroundColor: "#000000",
    pixelArt: true,
    roundPixels: true,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0, x: 0 },
        debug: isDebugEnabled,
      },
    },
    scale: scaleConfig,
    scene: [PreloadScene, GameScene],
  };
}

window.addEventListener("resize", () => {
  game.scale.refresh();
});

function getTouchControlImageProps() {
  return Object.values(controls.frames).map(({ name, frame }) => ({
    id: name,
    backgroundImage: `url(/bd-25/assets/images/hud/${controls.meta.image})`,
    backgroundPosition: `-${frame.x * ControlScale}px -${frame.y * ControlScale}px`,
    backgroundSize: `${controls.meta.size.w * ControlScale}px ${controls.meta.size.h * ControlScale}px`,
    width: `${frame.w * ControlScale}px`,
    height: `${frame.h * ControlScale}px`,
  }));
}

getTouchControlImageProps().forEach((control) => {
  const button = document.getElementById(control.id);

  if (!button) return;

  button.style.width = control.width;
  button.style.height = control.height;
  button.style.backgroundImage = control.backgroundImage;
  button.style.backgroundPosition = control.backgroundPosition;
  button.style.backgroundSize = control.backgroundSize;
});

const game = new Phaser.Game(getConfig());
