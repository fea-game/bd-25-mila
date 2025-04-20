# Birthday Detective Game - Asset Requirements & Optimization

This document outlines the required visual assets for the game and the recommended approach for optimizing them from larger source files.

## Asset Optimization Approach

To improve loading times and reduce memory usage, it's recommended to create optimized texture atlases (sprite sheets/tilesets) containing only the graphics actually used in the game.

1.  **Identify Required Graphics:** Based on the list below (derived from `docs/script.md`), identify the specific tiles and sprite frames needed from your source asset files.
2.  **Choose an Editing Tool:** Use a graphics editor suitable for pixel art and managing transparency (PNG). Recommended options:
    *   **Aseprite:** (Paid) Professional pixel art editor, excellent for sprite/tile management.
    *   **Piskel:** (Free, Web/Desktop) Simple and accessible for basic editing and arranging.
    *   **LibreSprite:** (Free) Open-source fork of an older Aseprite version.
    *   *(GIMP/Photoshop can work but are less specialized for pixel art workflows).*
3.  **Create New Atlases:**
    *   Create new, empty image files (e.g., `environment_tiles.png`, `character_sprites.png`, `item_sprites.png`).
    *   Carefully select and copy *only* the required graphics from the source files.
    *   Paste and arrange these graphics logically into the new files. Ensure a transparent background.
    *   Save the new optimized files as PNGs in the appropriate `assets/images/` subfolders (`tilesets`, `sprites`).
4.  **Record Coordinates:** For each individual graphic within your new atlases, record its exact top-left corner coordinates (x, y) and its dimensions (width, height). This data is crucial for the game engine to know where to find each graphic within the larger file. This can be done manually using the editor's tools or automatically if the editor supports exporting sprite sheet data (e.g., Aseprite JSON export).

## Required Assets List

*(Note: Dimensions like 16x16 or 16x24 are examples; use the actual dimensions of your chosen assets. Assumes a consistent tile size, e.g., 16x16 pixels.)*

**1. Tilesets (`assets/images/tilesets/`)**

*   **Living Room:**
    *   Floor tile (e.g., wood or carpet)
    *   Wall tile (interior)
    *   Window tile (open state)
    *   Table tile(s)
    *   Chair/Couch tile(s) (optional detail)
    *   Present tile(s)
    *   Poster tile (Easter egg)
    *   Empty Cake Stand tile (or part of table tile)
*   **Garden:**
    *   Grass tile
    *   Dirt Path tile
    *   Bush tile (regular)
    *   Flowerbed tile
    *   Garden Gnome tile
    *   Exterior House Wall tile (section with window)
    *   Path/Grass edge tiles (for transitions)
*   **Forest:**
    *   Forest Path tile
    *   Forest Grass/Ground tile
    *   Tree tile (regular)
    *   Big Oak Tree tile (distinct)
    *   Stream/Water tile(s) (and bank edges)
    *   Rock tile (optional detail)
    *   Sparkling Bush tile (for acorns)
    *   Forest edge tiles (transition to garden)

**2. Sprites (`assets/images/sprites/`)**

*   **Mila (Player):**
    *   Facing Down (Idle frame, Walk frame 1, Walk frame 2)
    *   Facing Up (Idle frame, Walk frame 1, Walk frame 2)
    *   Facing Left (Idle frame, Walk frame 1, Walk frame 2)
    *   Facing Right (Idle frame, Walk frame 1, Walk frame 2)
*   **NPCs:**
    *   Father (Standing pose)
    *   Mother (Standing pose)
    *   Sister (Standing pose)
    *   Walker (Standing pose)
    *   Dog (Sparky) (Standing pose, optional Sniffing pose)
    *   Raccoon (Sitting/Standing pose)
    *   Baby Raccoon(s) (Sitting pose)
*   **Items/Effects:**
    *   Cake Crumb sprite (small overlay/object)
    *   Paw Print sprite (small overlay/object)
    *   Grey Fur sprite (small overlay/object for bush)
    *   Half-eaten Berry sprite (small overlay/object)
    *   Shiny Acorn sprite (item/object)
    *   Birthday Cake sprite (Full, slightly nibbled version)

**3. UI (`assets/images/ui/` - *Optional folder*)**

*   Dialogue Box background/frame tile(s) (can be 9-sliced or a full image)

Remember to keep track of the coordinates and dimensions for each element as you create your optimized atlases.