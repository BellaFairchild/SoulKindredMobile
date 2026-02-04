export function rpm2dUrl(avatarId: string) {
  // Most reliable: always returns a 2D render
  return `https://models.readyplayer.me/${avatarId}.png`;
}
