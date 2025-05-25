import Phaser from "phaser";
import { Depth } from "../common/config";

export async function cinematicIntro({
  scene,
  player,
  duration = 3000,
  onComplete,
}: {
  scene: Phaser.Scene;
  player: Phaser.GameObjects.Sprite;
  duration?: number;
  onComplete?: () => void;
}) {
  const camera = scene.cameras.main;
  camera.startFollow(player);
  camera.setZoom(4);
  const title = scene.add
    .text(scene.cameras.main.centerX, scene.cameras.main.centerY, "Guten Morgen Mila!", {
      fontSize: "48px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 10,
    })
    .setAlpha(0.7)
    .setDepth(Depth.Hud)
    .setOrigin(0.5);

  await Promise.allSettled([
    new Promise((resolve) => {
      camera.once("camerafadeincomplete", () => {
        resolve(undefined);
      });
      camera.fadeIn(duration, 0, 0, 0);
    }),
    new Promise((resolve) => {
      scene.tweens.add({
        targets: camera,
        zoom: 1,
        duration: duration,
        ease: "Sine.easeInOut",
        delay: 500,
        onComplete: resolve,
      });
    }),
    new Promise((resolve) => {
      scene.time.delayedCall(duration * 1.5, () => {
        title.destroy();
        resolve(undefined);
      });
    }),
  ]);

  onComplete?.();
}
