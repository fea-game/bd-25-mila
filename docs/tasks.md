# Birthday Detective Game - Task Checklist

This document tracks the tasks required to complete the game project.

## Planning & Setup

*   [x] Initial project discussion and goal setting
*   [x] Decide on game style (Top-down, tile-based exploration)
*   [x] Plan core architecture (rendering, game loop, input, assets)
*   [x] Document architecture (`docs/architecture.md`)
*   [x] Develop story and script (`docs/script.md`)
*   [x] Define required assets (sprites, tilesets)
*   [x] Create initial project file structure (`index.html`, `style.css`, `game.js`, `assets/`, `docs/`)
*   [x] Organize documentation files (`README.md`, `docs/*`)
*   [ ] Decide on specific JavaScript library (Kaboom.js, Kontra.js, etc.) or confirm Vanilla JS approach

## Asset Creation / Collection

*   [ ] Create/Find Player Character Sprite Sheet (Mila - 4 directions + walk anim)
*   [ ] Create/Find NPC Sprite Sheets (Family, Walker, Dog, Raccoons)
*   [ ] Create/Find Indoor Tileset (Living Room elements)
*   [ ] Create/Find Outdoor Tileset (Garden/Forest elements)
*   [ ] Create/Find Item/Effect Sprites (Crumbs, Paw Prints, Fur, Berry, Acorn, Cake)
*   [ ] Create/Find UI elements (Dialogue box)
*   [ ] Create/Find Sound Effects (Optional)
*   [ ] Create/Find Background Music (Optional)

## Core Engine Development

*   [ ] Set up chosen library OR implement Canvas rendering basics
*   [ ] Implement Game Loop
*   [ ] Implement Keyboard Input Handling (Movement, Interaction)
*   [ ] Implement Asset Loading mechanism

## Gameplay Implementation

*   [ ] Implement Map Loading/Parsing
*   [ ] Implement Tilemap Rendering
*   [ ] Implement Player Sprite Rendering & Animation
*   [ ] Implement Player Movement Logic (Grid-based)
*   [ ] Implement Collision Detection (Tile-based)
*   [ ] Implement NPC Rendering
*   [ ] Implement Interaction System (Detecting objects/NPCs nearby + key press)
*   [ ] Implement Dialogue System (Displaying text from script)
*   [ ] Implement Clue/Inventory System (Tracking found items/info)
*   [ ] Implement Scene Transitions (Living Room <-> Garden <-> Forest)
*   [ ] Implement Puzzle 1 Logic (Stream crossing)
*   [ ] Implement Puzzle 2 Logic (Tree observation based on NPC hint)
*   [ ] Implement Puzzle 3 Logic (Acorn barter)
*   [ ] Implement Game Start/End sequences

## Polish & Testing

*   [ ] Integrate Sound Effects & Music (If created)
*   [ ] Refine UI elements
*   [ ] Conduct Playtesting
*   [ ] Debugging and Bug Fixing
*   [ ] Final review and adjustments