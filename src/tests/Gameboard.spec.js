import Gameboard from "../Gameboard.js";
import Ship from "../Ship.js";

test("gameboard can be created", () => {
  const board = new Gameboard();
  expect(board).toBeDefined();
});
