import Player from "./Player";
import Ship from "./Ship";

const gameController = (() => {
  const player1 = new Player();
  const player2 = new Player("computer");

  function playerAttack(x, y) {
    player2.gameboard.receiveAttack(x, y);
  }

  function computerMove() {
    let x;
    let y;

    const board = player1.gameboard;

    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    } while (board.attackedCoordinates.some((c) => c.x === x && c.y === y));

    player1.gameboard.receiveAttack(x, y);
  }

  function checkWinner() {
    if (player1.gameboard.allShipsSunk()) return player2;
    if (player2.gameboard.allShipsSunk()) return player1;

    return null;
  }

  function generateComputerShipCoords(shipLength) {
    const computerShipCoords = [];

    const startingCoord = {
      x: Math.floor(Math.random() * 10),
      y: Math.floor(Math.random() * 10),
      hit: false,
    };

    const orientation = Math.random() >= 0.5 ? "vertical" : "horizontal";

    if (orientation === "horizontal") {
      const direction = startingCoord.x + shipLength > 10 ? "left" : "right";

      if (direction === "right") {
        for (let i = 0; i < shipLength; i++) {
          computerShipCoords.push({ x: startingCoord.x + i, y: startingCoord.y, hit: false });
        }
      } else {
        for (let i = 0; i < shipLength; i++) {
          computerShipCoords.push({ x: startingCoord.x - i, y: startingCoord.y, hit: false });
        }
      }
    }

    if (orientation === "vertical") {
      const direction = startingCoord.y + shipLength > 10 ? "up" : "down";

      if (direction === "down") {
        for (let i = 0; i < shipLength; i++) {
          computerShipCoords.push({ x: startingCoord.x, y: startingCoord.y + i, hit: false });
        }
      } else {
        for (let i = 0; i < shipLength; i++) {
          computerShipCoords.push({ x: startingCoord.x, y: startingCoord.y - i, hit: false });
        }
      }
    }

    const overlapCheck = computerShipCoords.some((coord) =>
      player2.gameboard.ships.some((ship) =>
        ship.coordinates.some((existing) => existing.x === coord.x && existing.y === coord.y)
      )
    );

    if (overlapCheck) {
      return generateComputerShipCoords(shipLength);
    }

    return computerShipCoords;
  }

  function setupComputerShips() {
    const carrierCoords = generateComputerShipCoords(5);
    player2.gameboard.placeShip(new Ship(5), carrierCoords);

    const battleshipCoords = generateComputerShipCoords(4);
    player2.gameboard.placeShip(new Ship(4), battleshipCoords);

    const cruiserCoords = generateComputerShipCoords(3);
    player2.gameboard.placeShip(new Ship(3), cruiserCoords);
  }

  return {
    player1,
    player2,
    playerAttack,
    checkWinner,
    computerMove,
    setupComputerShips,
  };
})();

export default gameController;
