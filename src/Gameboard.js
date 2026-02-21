import Ship from "./Ship";

class Gameboard {
  constructor() {
    this.ships = [];
    this.missedAttacks = [];
  }

  placeShip(ship, x, y) {
    this.ships.push({ ship, x, y });
  }

  receiveAttack(x, y) {
    const attackedShip = this.ships.find((ship) => ship.x === x && ship.y === y);
    if (attackedShip) attackedShip.ship.hit();
    else this.missedAttacks.push({ x, y });
  }
}

export default Gameboard;
