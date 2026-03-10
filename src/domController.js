import gameController from "./gameController";
import Ship from "./Ship";

const domController = (() => {
  const playerBoard = document.querySelector("#player-board");
  const enemyBoard = document.querySelector("#enemy-board");
  const carrier = document.querySelector("#ship1");
  const battleship = document.querySelector("#ship2");
  const cruiser = document.querySelector("#ship3");
  let currentlyDraggedShipLength;

  function renderBoard(board, container, hideShips = false) {
    container.innerHTML = "";

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.x = x;
        cell.dataset.y = y;

        if (board.missedAttacks.some((c) => c.x === x && c.y === y)) {
          cell.style.background = "gray";
          cell.style.cursor = "not-allowed";
        }

        board.ships.forEach((ship) => {
          ship.coordinates.forEach((coord) => {
            if (coord.x === x && coord.y === y) {
              if (coord.hit) {
                cell.style.background = "red";
                cell.style.cursor = "not-allowed";
                if (ship.ship.isSunk()) {
                  cell.style.background = "black";
                }
              } else if (!hideShips) {
                cell.style.background = "green";
              }
            }
          });
        });

        container.appendChild(cell);
      }
    }
  }

  function renderGame() {
    renderBoard(gameController.player1.gameboard, playerBoard);
    renderBoard(gameController.player2.gameboard, enemyBoard, true);
  }

  enemyBoard.addEventListener("click", (e) => {
    if (!e.target.classList.contains("cell")) return;

    const x = Number(e.target.dataset.x);
    const y = Number(e.target.dataset.y);

    const enemyBoardState = gameController.player2.gameboard;

    if (enemyBoardState.attackedCoordinates.some((c) => c.x === x && c.y === y)) return;

    gameController.playerAttack(x, y);

    let winner = gameController.checkWinner();
    if (winner) {
      renderGame();
      enemyBoard.style.pointerEvents = "none";
      setTimeout(() => {
        alert("Game over!");
      }, 1);
      return;
    }

    gameController.computerMove();

    winner = gameController.checkWinner();
    if (winner) {
      renderGame();
      enemyBoard.style.pointerEvents = "none";
      setTimeout(() => {
        alert("Game over!");
      }, 1);
      return;
    }

    renderGame();
  });

  playerBoard.addEventListener("dragover", (e) => {
    const cell = e.target.closest(".cell");
    if (!cell) return;
    cell.preventDefault();
  });

  playerBoard.addEventListener("drop", (e) => {
    console.log("dropped a bomba");
    const cell = e.target.closest(".cell");
    if (!cell) return;

    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);

    const draggedShipCoords = [];

    for (let i = 0; i < currentlyDraggedShipLength; i++) {
      draggedShipCoords.push({ x: x + i, y: y, hit: false });
    }

    if (x < 6) {
      board.placeShip(new Ship(currentlyDraggedShipLength), draggedShipCoords);
    }
  });

  // carrier.addEventListener("dragstart", () => {
  //   console.log("started dragging");
  //   currentlyDraggedShipLength = 5;
  // });

  return { renderGame };
})();

export default domController;
