import { AnimationType, Character, Texture } from "../../../common/assets";
import { Depth } from "../../../common/config";
import { CharacterState } from "../../../components/game-object/state-machine/character/base-character-state";
import { IdleState } from "../../../components/game-object/state-machine/character/idle-state";
import { MovingState } from "../../../components/game-object/state-machine/character/moving-state";
import { BaseCharacter, Config as CharacterGameObjectConfig } from "../base-character";
import * as tiled from "../../../tiled/types";
import { Actor, InteractionComponent } from "../../../components/game-object/character/interaction-component";
import { InteractionType } from "../../../common/types";

type Config = Omit<CharacterGameObjectConfig, "animations" | "speed" | "texture" | "x" | "y"> & {
  properties: Pick<tiled.Player, "x" | "y">;
};

export class Player extends BaseCharacter implements Actor<typeof Player.InteractionTypes> {
  private static PlayerCharacterKey = "Mila";

  private static Animations: CharacterGameObjectConfig["animations"] = {
    character: Character[Player.PlayerCharacterKey],
    animations: [AnimationType.Idle, AnimationType.Walk],
  };

  private static InteractionTypes: InteractionType[] = ["action"];

  #isActor: InteractionComponent<typeof Player.InteractionTypes>;

  constructor({ properties, ...config }: Config) {
    super({
      ...config,
      id: Character[Player.PlayerCharacterKey],
      animations: Player.Animations,
      speed: 180,
      texture: Texture[Player.PlayerCharacterKey],
      x: properties.x,
      y: properties.y,
    });

    this.#isActor = new InteractionComponent(this, Player.InteractionTypes);

    this.stateMachine.addState(new IdleState(this, this.stateMachine));
    this.stateMachine.addState(new MovingState(this, this.stateMachine));
    this.stateMachine.setState(CharacterState.Idle);

    config.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    config.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      config.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
    });
  }

  get isActor(): InteractionComponent<typeof Player.InteractionTypes> {
    return this.#isActor;
  }
}
