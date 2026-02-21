import Ship from "./Ship";

class Gameboard {
  constructor() {
    this.ships = [];
  }

  placeShip(ship, x, y) {
    this.ships.push(ship);
  }
}

export default Gameboard;
