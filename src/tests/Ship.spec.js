import Ship from "../Ship";

test("ship stores its length", () => {
  const ship = new Ship(3);
  expect(ship.length).toBe(3);
});

test("ship starts with 0 hits", () => {
  const ship = new Ship(3);
  expect(ship.hits).toBe(0);
});

test("hit() increases hit count", () => {
  const ship = new Ship(3);
  ship.hit();
  expect(ship.hits).toBe(1);
});

test("isSunk() returns false if hits < length", () => {
  const ship = new Ship(3);
  ship.hit();
  expect(ship.isSunk()).toBe(false);
});

test("isSunk() returns true if hits >= length", () => {
  const ship = new Ship(2);
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
