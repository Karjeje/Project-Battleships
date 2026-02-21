import Gameboard from "../Gameboard.js";
import Ship from "../Ship.js";

test("gameboard can be created", () => {
  const board = new Gameboard();
  expect(board).toBeDefined();
});

test("places ship on the gameboard", () => {
  const board = new Gameboard();
  const ship = new Ship(3);

  board.placeShip(ship, 0, 0);

  expect(board.ships.length).toBe(1);
});

test("stores ship coordinates", () => {
  const board = new Gameboard();
  const ship = new Ship(3);

  board.placeShip(ship, 0, 2);

  expect(board.ships[0].x).toBe(0);
  expect(board.ships[0].y).toBe(2);
});
