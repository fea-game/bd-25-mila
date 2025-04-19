# Birthday Detective Game - Story Script

This document outlines the story, scenes, clues, puzzles, and interactions for the top-down detective game.

## Characters

*   **Mila:** The player character, a young detective on her birthday.
*   **Family:** Father, Mother, Sister (NPCs in Scene 1).
*   **Walker & Dog (Sparky):** NPCs in Scene 3.
*   **Raccoon Family:** NPCs (antagonists/quest givers) in Scene 3.
*   **(Mentioned) Mr. Fluffernutter:** Neighbour's cat (red herring).

## Mystery

Mila's birthday cake has vanished from the living room table on her birthday morning.

## Scene 1: The Birthday Morning (Living Room)

*   **Setting:** A cozy living room. Birthday table with presents/flowers, but an empty cake stand. An open window. Family members are present.
*   **Start:** Game begins here after a brief intro/wake-up sequence (optional).
*   **Initial Dialogue:**
    *   Family: "Happy Birthday, Mila!"
    *   Mother: "Your table is ready... but the cake is gone!"
    *   Father: "It just vanished!"
    *   Sister: "Maybe a ghost took it!"
*   **Player Goal:** Find out where the cake went.
*   **Clues & Interactions:**
    *   **Cake Spot:** Interact -> "Empty, but there are crumbs." -> *Clue: Crumbs.*
    *   **Floor near Table:** Interact -> "More crumbs, leading to the window." (Visual crumb trail).
    *   **Open Window:** Interact -> "Crumbs on the sill! The trail leads outside." -> *Objective: Investigate the Garden.* -> Enables exit to Garden.
    *   **Father:** Interact -> "Check carefully, maybe near the window?"
    *   **Mother:** Interact -> "Happy Birthday! Let us know if you see anything strange."
    *   **Sister:** Interact -> "I saw Mr. Fluffernutter in the garden! Maybe *he* knows!"
    *   **Poster:** Interact -> (Easter Egg) "It's a poster of [Artist Name]!"
    *   **Presents:** Interact -> (Easter Egg) "Presents! Cake first."

## Scene 2: The Garden Trail

*   **Setting:** The garden area outside the living room window. Path leading towards a forest edge.
*   **Player Goal:** Follow the trail from the window.
*   **Clues & Interactions:**
    *   **Ground near Window:** Interact -> "Paw prints! Too small for a cat..." -> *Clue: Mysterious Paw Prints.* (Visual prints leading away).
    *   **Bush near Window:** Interact -> "A piece of grey fur!" -> *Clue: Grey Fur.* -> "Looks like raccoon fur!"
    *   **Garden Gnome:** Interact -> (Distraction) "He looks grumpy."
    *   **Flower Bed:** Interact -> (Distraction) "Pretty flowers!"
    *   **Forest Edge (where prints lead):** Interact -> "The prints lead into the forest." -> *Objective: Follow the Trail into the Forest.* -> Enables exit to Forest.

## Scene 3: The Forest Encounter

*   **Setting:** A simple forest path with a stream, trees, and a clearing.
*   **Player Goal:** Track the raccoon and retrieve the cake.
*   **Puzzle 1 (Tracking):**
    *   Paw prints lead to a stream and stop.
    *   Player must walk along the bank until prints reappear on the other side.
    *   Interact with prints -> "Aha! The trail continues!"
*   **NPC Interaction:**
    *   Meet Walker & Dog (Sparky).
    *   Interact -> Walker mentions Sparky sniffing near a specific Big Oak Tree.
*   **Clue/Puzzle 2 (Observation):**
    *   Interact with Big Oak Tree -> "More prints... and a half-eaten berry from the cake decorations!" -> *Clue: Half-eaten Berry.* -> "Must be close!"
*   **Final Encounter & Puzzle 3 (Barter):**
    *   Find Raccoon family in a clearing with the slightly nibbled cake.
    *   Interact with Raccoon -> Squeaks, points at babies, won't give cake. -> *Objective: Find something else for the raccoons.*
    *   Explore scene -> Find Sparkling Bush.
    *   Interact with Sparkling Bush -> "Shiny acorns! Raccoons love these." -> *Item: Shiny Acorns.*
    *   Interact with Raccoon (with Acorns) -> Raccoon trades cake for acorns. -> Cake sprite becomes interactable.
    *   Interact with Cake -> "Got the cake back!" -> *Item: Birthday Cake (Slightly Nibbled).* -> *Objective: Return Home!* -> Enables exit back towards Garden/Living Room.

## Ending

*   Player returns to the Living Room (or triggers end screen directly).
*   Final dialogue with family explaining the raccoon adventure.
*   End screen: "Happy Birthday, Detective Mila!"