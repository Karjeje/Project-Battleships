import gameController from "./gameController";
import Ship from "./Ship";

const domController = (() => {
  const playerBoard = document.querySelector("#player-board");
  const enemyBoard = document.querySelector("#enemy-board");
  const carrier = document.querySelector("#ship1");
  const battleship = document.querySelector("#ship2");
  const cruiser = document.querySelector("#ship3");
  let currentlyDraggedShipLength;
  let orientation = "horizontal";

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

  document.addEventListener("keydown", (e) => {
    if (!currentlyDraggedShipLength) return;
    if (e.key.toLowerCase() === "r") {
      orientation = orientation === "horizontal" ? "vertical" : "horizontal";
    }
    console.log("orientation:", orientation);
  });

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
    if (!currentlyDraggedShipLength) return;

    const cell = e.target.closest(".cell");
    if (!cell) return;

    let status = "valid";

    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);

    playerBoard.querySelectorAll(".preview, .invalid").forEach((cell) => {
      cell.classList.remove("preview", "invalid");
    });

    const previewShipCoords = [];

    if (orientation === "horizontal") {
      for (let i = 0; i < currentlyDraggedShipLength; i++) {
        previewShipCoords.push({ x: x + i, y: y, hit: false });
      }
    } else if (orientation === "vertical") {
      for (let i = 0; i < currentlyDraggedShipLength; i++) {
        previewShipCoords.push({ x: x, y: y + i, hit: false });
      }
    }

    if (orientation === "horizontal") {
      if (x + currentlyDraggedShipLength > 10) {
        status = "invalid";
      }
    }

    if (orientation === "vertical") {
      if (y + currentlyDraggedShipLength > 10) {
        status = "invalid";
      }
    }

    const overlapCheck = previewShipCoords.some((coord) =>
      gameController.player1.gameboard.ships.some((ship) =>
        ship.coordinates.some((existing) => existing.x === coord.x && existing.y === coord.y)
      )
    );

    if (overlapCheck) {
      status = "invalid";
    }

    previewShipCoords.forEach((coord) => {
      const previewCell = playerBoard.querySelector(`[data-x="${coord.x}"][data-y="${coord.y}"]`);

      if (!previewCell) return;

      previewCell.classList.add("preview");

      if (status === "invalid") previewCell.classList.add("invalid");
    });

    e.preventDefault();
  });

  playerBoard.addEventListener("drop", (e) => {
    if (!currentlyDraggedShipLength) return;

    const cell = e.target.closest(".cell");
    if (!cell) return;

    const x = Number(cell.dataset.x);
    const y = Number(cell.dataset.y);

    console.log("Dropping ship at:", x, y);

    const newShipCoords = [];

    if (orientation === "horizontal") {
      for (let i = 0; i < currentlyDraggedShipLength; i++) {
        newShipCoords.push({ x: x + i, y: y, hit: false });
      }
    } else if (orientation === "vertical") {
      for (let i = 0; i < currentlyDraggedShipLength; i++) {
        newShipCoords.push({ x: x, y: y + i, hit: false });
      }
    }

    if (orientation === "horizontal") {
      if (x + currentlyDraggedShipLength > 10) {
        console.log("Ship was placed out of bounds.");
        return;
      }
    }

    if (orientation === "vertical") {
      if (y + currentlyDraggedShipLength > 10) {
        console.log("Ship was placed out of bounds.");
        return;
      }
    }

    const overlapCheck = newShipCoords.some((coord) =>
      gameController.player1.gameboard.ships.some((ship) =>
        ship.coordinates.some((existing) => existing.x === coord.x && existing.y === coord.y)
      )
    );

    if (overlapCheck) {
      console.log("Ships were overlapping.");
      return;
    }

    gameController.player1.gameboard.placeShip(new Ship(currentlyDraggedShipLength), newShipCoords);

    if (currentlyDraggedShipLength === 5) carrier.remove();
    else if (currentlyDraggedShipLength === 4) battleship.remove();
    else cruiser.remove();

    currentlyDraggedShipLength = null;

    playerBoard.querySelectorAll(".preview, .invalid").forEach((cell) => {
      cell.classList.remove("preview", "invalid");
    });

    renderGame();
  });

  carrier.addEventListener("dragstart", () => {
    console.log("started dragging carrier");
    currentlyDraggedShipLength = 5;
    orientation = "horizontal";
  });

  battleship.addEventListener("dragstart", () => {
    console.log("started dragging battleship");
    currentlyDraggedShipLength = 4;
    orientation = "horizontal";
  });

  cruiser.addEventListener("dragstart", () => {
    console.log("started dragging cruiser");
    currentlyDraggedShipLength = 3;
    orientation = "horizontal";
  });

  return { renderGame };
})();

export default domController;
