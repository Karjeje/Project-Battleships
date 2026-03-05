import Player from "../Player";

test("player has gameboard", () => {
  const player = new Player();

  expect(player.gameboard).toBeDefined();
});

test("a computer can be a player", () => {
  const player = new Player("computer");

  expect(player.type).toBe("computer");
});

test("player defaults to human", () => {
  const player = new Player();

  expect(player.type).toBe("human");
});
