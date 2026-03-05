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

  function computerMove() {
    const x = Math.floor(Math.random() * 10);
    const y = Math.floor(Math.random() * 10);

    attack(x, y);
  }

  function checkWinner() {
    if (player1.gameboard.allShipsSunk()) return player2;
    if (player2.gameboard.allShipsSunk()) return player1;

    return null;
  }

  player1.gameboard.placeShip(new Ship(3), [
    { x: 0, y: 0, hit: false },
    { x: 1, y: 0, hit: false },
    { x: 2, y: 0, hit: false },
  ]);
  player1.gameboard.placeShip(new Ship(4), [
    { x: 2, y: 5, hit: false },
    { x: 3, y: 5, hit: false },
    { x: 4, y: 5, hit: false },
    { x: 5, y: 5, hit: false },
  ]);
  player2.gameboard.placeShip(new Ship(3), [
    { x: 2, y: 5, hit: false },
    { x: 3, y: 5, hit: false },
    { x: 4, y: 5, hit: false },
  ]);
  player2.gameboard.placeShip(new Ship(4), [
    { x: 2, y: 0, hit: false },
    { x: 2, y: 1, hit: false },
    { x: 2, y: 2, hit: false },
    { x: 2, y: 3, hit: false },
  ]);

  return {
    player1,
    player2,
    switchTurn,
    attack,
    checkWinner,
    computerMove,
  };
})();
