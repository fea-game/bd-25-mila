import { NpcType } from "../../game-objects/characters/npc";
import { GameStateManager } from "../../manager/game-state-manager";
import { DialogScript } from "./dialog-script";

export const HouseDialogs = {
  Narrator: new DialogScript([
    {
      id: "dialog-house-1",
      text:
        "Guten Morgen Mila, es ist dein 9. Geburtstag!\n" +
        "Wie du siehst, wartet deine Familie schon auf dich im Wohnzimmer. " +
        "Schnell, geh zu ihnen! Es gibt bestimmt tolle Geschenke und einen leckeren Kuchen für dich.",
      isAvailable: () => {
        if (GameStateManager.instance.house.wokeUp) return false;
        if (GameStateManager.instance.isDialogFinished("dialog-house-1")) return false;

        return true;
      },
    },
  ]),
  Amelie: new DialogScript([]),
  Cynthia: new DialogScript([]),
  Tobias: new DialogScript([
    {
      id: "dialog-house-tobias-1",
      text: "Papa: Hallo Mila!",
      isAvailable: () => {
        if (!GameStateManager.instance.house.happyBirthdaySung) return false;
        if (GameStateManager.instance.isDialogFinished("dialog-house-tobias-1")) return false;

        return true;
      },
    },
    {
      id: "dialog-house-tobias-2",
      text: "Papa: Ja, ich bin noch hier.",
      isAvailable: () => {
        if (!GameStateManager.instance.house.happyBirthdaySung) return false;
        if (!GameStateManager.instance.isDialogFinished("dialog-house-tobias-1")) return false;

        return true;
      },
    },
  ]),
} satisfies Record<NpcType | "Narrator", DialogScript>;
