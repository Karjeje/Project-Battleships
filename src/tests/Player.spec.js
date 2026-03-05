import Player from "../Player";

test("player has gameboard", () => {
  const player = new Player();

  expect(player.gameboard).toBeDefined();
});
