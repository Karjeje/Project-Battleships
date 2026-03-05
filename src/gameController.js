import Ship from "./Ship";
import Gameboard from "./Gameboard";
import Player from "./Player";

const gameController = (() => {
  const player1 = new Player();
  const player2 = new Player("computer");

  let currentPlayer = player1;

  return {
    player1,
    player2,
  };
})();
