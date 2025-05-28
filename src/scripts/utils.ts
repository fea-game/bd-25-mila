import Phaser from "phaser";
import { Depth } from "../common/config";
import { Npc } from "../game-objects/characters/npc";
import { Objects } from "../components/game-scene/objects-component";

export async function playCinematicIntro({
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
    .text(scene.cameras.main.centerX, scene.cameras.main.centerY + 24, "Guten Morgen Mila!", {
      fontSize: `${48 / camera.zoom}px`,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
    })
    .setAlpha(0.7)
    .setDepth(Depth.Hud)
    .setOrigin(0.5);

  await Promise.allSettled([
    new Promise((resolve) => {
      camera.once("camerafadeincomplete", () => {
        resolve(undefined);
      });
      camera.fadeIn(duration, 0, 0, 0, () => {
        title.setFontSize(`${48 / camera.zoom}px`);
      });
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

type Npcs = { father: Npc; mother: Npc; sister: Npc };

export function getNpcs(objects: Objects): Partial<Npcs> {
  return objects.npc.getChildren().reduce((npcs: Partial<Npcs>, npc) => {
    if (!(npc instanceof Npc)) return npcs;

    switch (npc.npcType) {
      case "Amelie":
        npcs.sister = npc;
        break;
      case "Cynthia":
        npcs.mother = npc;
        break;
      case "Tobias":
        npcs.father = npc;
        break;
    }

    return npcs;
  }, {});
}

type RequireKeys<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: T[P] };

export function assertNpcsPresent<K extends keyof Npcs>(
  npcs: Partial<Npcs>,
  requiredKeys: K[]
): asserts npcs is RequireKeys<Npcs, K> {
  const missing = requiredKeys.filter((key) => !npcs[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required NPCs: ${missing.join(", ")}`);
  }
}
