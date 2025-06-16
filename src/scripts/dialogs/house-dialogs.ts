import { NpcType } from "../../game-objects/characters/npc";
import { GameStateManager } from "../../manager/game-state-manager";
import { DialogScript } from "./dialog-script";

export const HouseDialogs = {
  Narrator: new DialogScript([
    {
      id: "dialog-house-1",
      text:
        "Guten Morgen Mila, es ist dein 9. Geburtstag! \n" +
        "Wie du siehst, wartet deine Familie schon auf dich im Wohnzimmer. " +
        "Schnell, geh zu ihnen! Es gibt bestimmt tolle Geschenke und einen leckeren Kuchen für dich.",
      isAvailable: () => {
        if (GameStateManager.instance.house.wokeUp) return false;
        if (GameStateManager.instance.isDialogFinished("dialog-house-1")) return false;

        return true;
      },
    },
    {
      id: "dialog-house-2",
      text: "Wo ist denn der Kuchen? Der sollte doch hier stehen, oder?",
      isAvailable: () => {
        if (GameStateManager.instance.house.discoveredCakeIsMissing) return false;

        return true;
      },
    },
    {
      id: "dialog-house-3",
      text: "Oh, da liegen Kuchenkrümel.",
      isAvailable: () => {
        if (GameStateManager.instance.house.numCrumbsDiscovered === 0) return false;
        if (GameStateManager.instance.house.discoveredThief) return false;

        return true;
      },
    },
    {
      id: "dialog-house-4",
      text:
        "Na sowas, da dachte wohl noch jemand das der Kuchen lecker aussieht. " +
        "Vielleicht kannst du ihn ja überzeugen ihn dir zurück zu geben.",
      isAvailable: () => {
        if (!GameStateManager.instance.house.discoveredThief) return false;
        if (GameStateManager.instance.house.foodForThiefReceived) return false;

        return true;
      },
    },
    {
      id: "dialog-house-5",
      text: "Mila hat ein Würstchen erhalten.",
      isAvailable: () => {
        if (!GameStateManager.instance.house.foodForThiefReceived) return false;
        if (GameStateManager.instance.house.obtainedCake) return false;

        return true;
      },
    },
    {
      id: "dialog-house-6",
      text:
        "Toll, du hast den Kuchen zurück bekommen. Sieht er nicht lecker aus? " +
        "Schnell, bring ihn zurück an seinen Platz, deine Mama wird bestimmt erleichtert sein.",
      isAvailable: () => {
        if (!GameStateManager.instance.house.obtainedCake) return false;
        if (GameStateManager.instance.house.putCakeBack) return false;

        return true;
      },
    },
    {
      id: "dialog-house-7",
      text:
        "Bravo, du hast es geschafft! \n" +
        "Du hast den Kuchen gefunden und zurück gebracht. " +
        "Jetzt können du und deine Familie ihn euch schmecken lassen. " +
        "Guten Appetit und noch einen wunderschönen Geburtstagstag für dich.",
      isAvailable: () => {
        if (!GameStateManager.instance.house.putCakeBack) return false;
        if (GameStateManager.instance.isDialogFinished("dialog-house-7")) return false;

        return true;
      },
    },
  ]),
  Amelie: new DialogScript([
    {
      id: "dialog-house-amelie-1",
      text: "Amelie: HAPPY BIRTHDAY!!!! \n" + "Ich habe dich soooo doll lieb! 💖",
      isAvailable: () => {
        if (!GameStateManager.instance.house.happyBirthdaySung) return false;
        if (GameStateManager.instance.house.discoveredCakeIsMissing) return false;
        if (GameStateManager.instance.isDialogFinished("dialog-house-amelie-1")) return false;

        return true;
      },
    },
    {
      id: "dialog-house-amelie-2",
      text: "Amelie: NEIIIIIIN!!! Der Kuchen ist weg? Das kann doch nicht sein. 😱",
      isAvailable: () => {
        if (!GameStateManager.instance.house.discoveredCakeIsMissing) return false;
        if (GameStateManager.instance.house.discoveredThief) return false;
        if (GameStateManager.instance.isDialogFinished("dialog-house-amelie-2")) return false;

        return true;
      },
    },
    {
      id: "dialog-house-amelie-3",
      text: "Amelie: Was, ein Waschbär hat den Kuchen geklaut? Och der Arme, er hatte bestimmt Hunger.",
      isAvailable: () => {
        if (!GameStateManager.instance.house.discoveredThief) return false;
        if (GameStateManager.instance.house.obtainedCake) return false;
        if (GameStateManager.instance.isDialogFinished("dialog-house-amelie-3")) return false;

        return true;
      },
    },
    {
      id: "dialog-house-amelie-4",
      text: "Amelie: Juchuuu, du hast den Kuchen gefunden. Kann ich ein Stück haben? 😋",
      isAvailable: () => {
        if (!GameStateManager.instance.house.putCakeBack) return false;
        if (GameStateManager.instance.isDialogFinished("dialog-house-amelie-4")) return false;

        return true;
      },
    },
  ]),
  Cynthia: new DialogScript([
    {
      id: "dialog-house-cynthia-1",
      text:
        "Mama: ¡Feliz cumpleaños, mi princesita! 🎉 \n" +
        "Hoy cumples 9 años y no puedo creer lo rápido que estás creciendo. " +
        "Me siento tan orgullosa de la niña hermosa, inteligente y cariñosa que eres. " +
        "Cada día me enseñas algo nuevo con tu sonrisa, tu ternura y tu alegría. \n\n" +
        "Gracias por hacerme la mamá más feliz del mundo. Te amo con todo mi corazón, mi vida. ❤️ " +
        "Que este día esté lleno de risas, abrazos, pastel y mucha diversión. ¡Te mereces lo mejor del universo!",
      isAvailable: () => {
        if (!GameStateManager.instance.house.happyBirthdaySung) return false;
        if (GameStateManager.instance.house.discoveredCakeIsMissing) return false;
        if (GameStateManager.instance.isDialogFinished("dialog-house-cynthia-1")) return false;

        return true;
      },
    },
    {
      id: "dialog-house-cynthia-2",
      text:
        "Mama: ¿Cómo que ya no está el pastel? ¡Pero si lo dejé en la mesa hace un momentito! 😰 \n" +
        "¿Tú crees que hayan sido fantasmas de verdad? " +
        "¡Ay, yo siempre lo supe! Pero tu papá dice que estoy loca… y nunca me cree. 🙄",
      isAvailable: () => {
        if (!GameStateManager.instance.house.discoveredCakeIsMissing) return false;
        if (GameStateManager.instance.house.discoveredThief) return false;
        if (GameStateManager.instance.isDialogFinished("dialog-house-cynthia-2")) return false;

        return true;
      },
    },
    {
      id: "dialog-house-cynthia-3",
      text:
        "Mama: Pero… el pastel no está. ¿Cómo vamos a tener un cumpleaños sin pastel? " +
        "¡Un cumpleaños sin pastel no es un cumpleaños de verdad! 😤",
      isAvailable: () => {
        if (!GameStateManager.instance.house.discoveredCakeIsMissing) return false;
        if (GameStateManager.instance.house.discoveredThief) return false;
        if (GameStateManager.instance.isDialogFinished("dialog-house-cynthia-3")) return false;

        return true;
      },
    },
    {
      id: "dialog-house-cynthia-4",
      text:
        "Mama: ¡Ay, mi amor! ¡Qué alivio! ¡Encontraste el pastel y lo trajiste de vuelta! 😍 " +
        "Estoy tan orgullosa de ti… mi valiente detective.\n" +
        "¿Un mapache se lo llevó? ¡No lo puedo creer. Y yo pensando que eran fantasmas… hahaha 😆",
      isAvailable: () => {
        if (!GameStateManager.instance.house.putCakeBack) return false;
        if (GameStateManager.instance.isDialogFinished("dialog-house-cynthia-4")) return false;

        return true;
      },
    },
  ]),
  Tobias: new DialogScript([
    {
      id: "dialog-house-tobias-1",
      text:
        "Papa: Alles Gute zum Geburtstag mein Schatz!!!! 🎉 \n" +
        "Ich wünsche dir viel Gesundheit, Glück, Zufriedenheit und ganz ganz viel Spaß in deinem neuen Lebensjahr. \n" +
        "Hast du schon den leckeren Kuchen gesehen den Mama für dich gebacken hat? 😊",
      isAvailable: () => {
        if (!GameStateManager.instance.house.happyBirthdaySung) return false;
        if (GameStateManager.instance.house.discoveredCakeIsMissing) return false;
        if (GameStateManager.instance.isDialogFinished("dialog-house-tobias-1")) return false;

        return true;
      },
    },
    {
      id: "dialog-house-tobias-2",
      text: "Papa: Was, der Kuchen ist weg? Das kann doch gar nicht sein. Vorhin war er noch da. 😟",
      isAvailable: () => {
        if (!GameStateManager.instance.house.discoveredCakeIsMissing) return false;
        if (GameStateManager.instance.house.numCrumbsDiscovered > 0) return false;
        if (GameStateManager.instance.house.discoveredThief) return false;
        if (GameStateManager.instance.isDialogFinished("dialog-house-tobias-2")) return false;

        return true;
      },
    },
    {
      id: "dialog-house-tobias-3",
      text:
        "Papa: Was, du hast Kuchenkrümel auf dem Boden gefunden? " +
        "Vielleicht findest du noch mehr und sie führen dich zu dem Kuchen!? 🕵️",
      isAvailable: () => {
        if (GameStateManager.instance.house.numCrumbsDiscovered === 0) return false;
        if (GameStateManager.instance.house.discoveredThief) return false;
        if (GameStateManager.instance.isDialogFinished("dialog-house-tobias-3")) return false;

        return true;
      },
    },
    {
      id: "dialog-house-tobias-4",
      text:
        "Papa: Was, ein Washbär hat den Kuchen gemopst? Hahaha, das ist schon irgendwie lustig. 😄 " +
        "Wie du ihn zurück bekommen kannst? Hmmm, vielleicht hat er Hunger, vielleicht hilft es, " +
        "wenn du ihm etwas anderes zu essen anbietest? \n" +
        "Hier, nimm ein Würstchen, vielleicht mag er das!?",
      isAvailable: () => {
        if (!GameStateManager.instance.house.discoveredThief) return false;
        if (GameStateManager.instance.house.foodForThiefReceived) return false;

        return true;
      },
    },
    {
      id: "dialog-house-tobias-5",
      text: "Papa: Super, du hast den Kuchen zurück bekommen. 🎉 Hat ihm das Würstchen geschmeckt?",
      isAvailable: () => {
        if (!GameStateManager.instance.house.obtainedCake) return false;
        if (GameStateManager.instance.house.putCakeBack) return false;
        if (GameStateManager.instance.isDialogFinished("dialog-house-tobias-5")) return false;

        return true;
      },
    },
    {
      id: "dialog-house-tobias-6",
      text:
        "Papa: Großartig, Detektivin Mila hat einen weiteren Fall gelöst. " +
        "Ich bin stolz auf dich! Jetzt lassen wir uns aber den Kuchen schmecken. 😋",
      isAvailable: () => {
        if (!GameStateManager.instance.house.putCakeBack) return false;
        if (GameStateManager.instance.isDialogFinished("dialog-house-tobias-6")) return false;

        return true;
      },
    },
  ]),
  Thief: new DialogScript([
    {
      id: "dialog-house-thief-1",
      text: "Waschbär: Chrrrrk! Hssss! Grrrff! Chik-chik-chik!",
      isAvailable: () => {
        if (!GameStateManager.instance.house.discoveredCakeIsMissing) return false;
        if (GameStateManager.instance.house.foodForThiefReceived) return false;
        if (GameStateManager.instance.isDialogFinished("dialog-house-thief-1")) return false;

        return true;
      },
    },
    {
      id: "dialog-house-thief-2",
      text: "Waschbär: Chik-chik! Mrrreeee! 🌭🔄🍰 ❤️",
      isAvailable: () => {
        if (!GameStateManager.instance.house.discoveredThief) return false;
        if (!GameStateManager.instance.house.foodForThiefReceived) return false;

        return true;
      },
    },
  ]),
} satisfies Record<NpcType | "Narrator", DialogScript>;
