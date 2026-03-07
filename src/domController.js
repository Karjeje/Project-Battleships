import gameController from "./gameController";

const domController = (() => {
  const playerBoard = document.querySelector("player-board");
  const enemyBoard = document.querySelector("enemy-board");

  function renderBoard(board, container, hideShips = false) {
    container.innerHTML = "";

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.x = x;
        cell.dataset.y = y;

        container.appendChild(cell);
      }
    }
  }

  function renderGame() {
    renderBoard(gameController.player1.gameboard, playerBoard);
    renderBoard(gameController.player2.gameboard, enemyBoard, true);
  }

  enemyBoard.addEventListener("click", (e) => {
    const x = Number(e.target.dataset.x);
    const y = Number(e.target.dataset.y);

    gameController.attack(x, y);

    renderGame();
  });

  return { renderGame };
})();

export default domController;
