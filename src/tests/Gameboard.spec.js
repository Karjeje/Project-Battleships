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

  board.placeShip(ship, [
    { x: 0, y: 2, hit: false },
    { x: 1, y: 2, hit: false },
    { x: 2, y: 2, hit: false },
  ]);

  expect(board.ships[0].coordinates.length).toBe(3);
});

test("receiveAttack registers a hit", () => {
  const board = new Gameboard();
  const ship = new Ship(3);

  board.placeShip(ship, [
    { x: 0, y: 2, hit: false },
    { x: 1, y: 2, hit: false },
    { x: 2, y: 2, hit: false },
  ]);
  board.receiveAttack(0, 2);
  expect(ship.hits).toBe(1);
});

test("receiveAttack stores missed attacks", () => {
  const board = new Gameboard();
  const ship = new Ship(3);

  board.placeShip(ship, [
    { x: 0, y: 2, hit: false },
    { x: 1, y: 2, hit: false },
    { x: 2, y: 2, hit: false },
  ]);
  board.receiveAttack(0, 1);
  expect(board.missedAttacks.length).toBe(1);
});
