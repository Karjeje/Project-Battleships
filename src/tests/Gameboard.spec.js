import Gameboard from "../Gameboard.js";
import Ship from "../Ship.js";

test("gameboard can be created", () => {
  const board = new Gameboard();
  expect(board).toBeDefined();
});

test("places a ship at given coordinates", () => {
  const board = new Gameboard();
  const ship = new Ship(3);

  board.placeShip(ship, 0, 0);

  expect(board.ships.length).toBe(1);
});
