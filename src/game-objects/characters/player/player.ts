import {
  CharacterGameObject,
  Config as CharacterGameObjectConfig,
} from "../character-game-object";

type Config = Omit<CharacterGameObjectConfig, "animations">;

export class Player extends CharacterGameObject {
  private static animations: CharacterGameObjectConfig["animations"] = {
    WALK_DOWN: { key: "walk-down", repeat: -1, ignoreIfPlaying: true },
    WALK_LEFT: { key: "walk-left", repeat: -1, ignoreIfPlaying: true },
    WALK_RIGHT: { key: "walk-right", repeat: -1, ignoreIfPlaying: true },
    WALK_UP: { key: "walk-up", repeat: -1, ignoreIfPlaying: true },
  };

  constructor(config: Config) {
    super({ ...config, animations: Player.animations });
  }
}
