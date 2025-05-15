import {
  CharacterGameObject,
  Config as CharacterGameObjectConfig,
} from "../character-game-object";

type Config = Omit<CharacterGameObjectConfig, "animations">;

export class Player extends CharacterGameObject {
  private static animations: CharacterGameObjectConfig["animations"] = {
    IDLE_DOWN: { key: "player-idle-down", repeat: -1, ignoreIfPlaying: true },
    IDLE_LEFT: { key: "player-idle-left", repeat: -1, ignoreIfPlaying: true },
    IDLE_RIGHT: { key: "player-idle-right", repeat: -1, ignoreIfPlaying: true },
    IDLE_UP: { key: "player-idle-up", repeat: -1, ignoreIfPlaying: true },
    WALK_DOWN: { key: "player-walk-down", repeat: -1, ignoreIfPlaying: true },
    WALK_LEFT: { key: "player-walk-left", repeat: -1, ignoreIfPlaying: true },
    WALK_RIGHT: { key: "player-walk-right", repeat: -1, ignoreIfPlaying: true },
    WALK_UP: { key: "player-walk-up", repeat: -1, ignoreIfPlaying: true },
  };

  constructor(config: Config) {
    super({ ...config, animations: Player.animations });
  }
}
