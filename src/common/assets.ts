export const SpriteAtlas = {
  character: {
    textureUrl: "assets/images/characters/character.png",
    atlasUrl: "assets/images/characters/character.atlas.json",
  },
  test: {
    textureUrl: "assets/images/characters/character.png",
    atlasUrl: "assets/images/characters/character.atlas.json",
  },
} as const satisfies Record<string, { textureUrl: string; atlasUrl: string }>;

export type Sprite = keyof typeof SpriteAtlas;

export const Animation = {
  character: { url: "assets/images/characters/character.animations.json" },
} as const satisfies Partial<Record<Sprite, { url: string }>>;
