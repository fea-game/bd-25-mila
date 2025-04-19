# Resume Prompt: Birthday Detective Game

**Project Goal:** Build a short (~15 min) top-down, tile-based detective game for Mila's 9th birthday, playable in a web browser.

**Current Status:**
*   Planning phase is complete.
*   Game style decided: Top-down exploration with keyboard controls.
*   Architecture documented in `docs/architecture.md`.
*   Story script and scene details documented in `docs/script.md`.
*   Required assets list defined (sprites, tilesets).
*   Project tasks checklist created in `docs/tasks.md`.
*   Basic file structure exists (`index.html`, `style.css`, `game.js`, `assets/`, `docs/`).
*   Currently in **Code mode**.

**Next Step: Assets**
*   The immediate next step is to decide how to handle the visual assets (sprites, tilesets listed in `docs/script.md`).
*   **Option 1:** Find/Create the necessary assets now. You can provide them, or I can suggest resources.
*   **Option 2:** Proceed with simple placeholder graphics (e.g., colored squares) for now, allowing us to build the core mechanics first.

**Decision Needed for Implementation:**
*   **JavaScript Approach:** While assets are gathered/placeholders defined, we also need to confirm the technical approach:
    *   Using **Kaboom.js** (Recommended for simplicity).
    *   Using Vanilla JS + HTML Canvas.
    *   Using another library.

**Next Steps (Based on Asset Choice):**
1.  **Asset Handling:**
    *   If using real assets: Place the found/created image files into the `assets/images/sprites` and `assets/images/tilesets` folders.
    *   If using placeholders: We will define placeholder representations in the code.
2.  **Setup Tech (Confirm JS Approach first):**
    *   Integrate chosen library (e.g., Kaboom.js) or set up Canvas API in `index.html` and `game.js`.
3.  **Load Assets/Placeholders:**
    *   Implement code to load the real assets or define the placeholder graphics within the chosen tech framework.
4.  **Start Core Engine:** Begin implementing the game loop, input handling, and basic rendering using the loaded assets/placeholders (refer to `docs/tasks.md`).

**To Resume:**
Let me know how you want to proceed with assets (find/create now or use placeholders) and confirm your preferred JavaScript approach (Kaboom.js recommended).