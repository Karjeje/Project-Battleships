import Gameboard from "../Gameboard.js";
import Ship from "../Ship.js";

test("gameboard can be created", () => {
  const board = new Gameboard();
  expect(board).toBeDefined();
});

test("places ship on the gameboard", () => {
  const board = new Gameboard();
  const ship = new Ship(3);

  board.placeShip(ship, [{ x: 0, y: 0, hit: false }]);

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

test("reports false if not all ships are sunk", () => {
  const board = new Gameboard();
  const ship = new Ship(3);

  board.placeShip(ship, [
    { x: 0, y: 2, hit: false },
    { x: 1, y: 2, hit: false },
    { x: 2, y: 2, hit: false },
  ]);

  expect(board.allShipsSunk()).toBe(false);
});

test("reports true when all ships are sunk", () => {
  const board = new Gameboard();
  const ship = new Ship(3);

  board.placeShip(ship, [
    { x: 0, y: 2, hit: false },
    { x: 1, y: 2, hit: false },
    { x: 2, y: 2, hit: false },
  ]);

  board.receiveAttack(0, 2);
  board.receiveAttack(1, 2);
  board.receiveAttack(2, 2);

  expect(board.allShipsSunk()).toBe(true);
});

test("returns false if at least one ship is not sunk", () => {
  const board = new Gameboard();
  const ship1 = new Ship(1);
  const ship2 = new Ship(1);

  board.placeShip(ship1, [{ x: 0, y: 0, hit: false }]);
  board.placeShip(ship2, [{ x: 1, y: 0, hit: false }]);

  board.receiveAttack(0, 0);

  expect(board.allShipsSunk()).toBe(false);
});
