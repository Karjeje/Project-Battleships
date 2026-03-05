import Ship from "./Ship";
import Gameboard from "./Gameboard";
import Player from "./Player";

const gameController = (() => {
  const player1 = new Player();
  const player2 = new Player("computer");

  let currentPlayer = player1;

  function switchTurn() {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  }

  function attack(x, y) {
    const enemy = currentPlayer === player1 ? player2 : player1;

    enemy.gameboard.receiveAttack(x, y);

    switchTurn();
  }

  function checkWinner() {
    if (player1.gameboard.allShipsSunk()) return player2;
    if (player2.gameboard.allShipsSunk()) return player1;

    return null;
  }

  return {
    player1,
    player2,
    switchTurn,
    attack,
    checkWinner,
  };
})();
