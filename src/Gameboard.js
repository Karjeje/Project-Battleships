import Ship from "./Ship";

class Gameboard {
  constructor() {
    this.ships = [];
  }

  placeShip(ship, x, y) {
    this.ships.push({ ship, x, y });
  }

  receiveAttack(x, y) {
    const attackedShip = this.ships.find((ship) => ship.x === x && ship.y === y);
    attackedShip.ship.hit();
  }
}

export default Gameboard;
