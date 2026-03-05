import Ship from "./Ship";

class Gameboard {
  constructor() {
    this.ships = [];
    this.missedAttacks = [];
    this.attackedCoordinates = [];
  }

  placeShip(ship, coordinates) {
    this.ships.push({ ship, coordinates });
  }

  receiveAttack(x, y) {
    if (this.attackedCoordinates.some((coord) => coord.x === x && coord.y === y)) return;

    this.attackedCoordinates.push({ x, y });

    const attackedShip = this.ships.find((ship) =>
      ship.coordinates.some((coord) => coord.x === x && coord.y === y)
    );
    if (attackedShip) {
      const coord = attackedShip.coordinates.find((c) => c.x === x && c.y === y);
      coord.hit = true;
      attackedShip.ship.hit();
    } else {
      this.missedAttacks.push({ x, y });
    }
  }

  allShipsSunk() {
    return this.ships.every((shipObj) => shipObj.ship.isSunk());
  }
}

export default Gameboard;
