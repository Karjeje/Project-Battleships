import gameController from "./gameController";
import Ship from "./Ship";

const domController = (() => {
  const playerBoard = document.querySelector("#player-board");
  const enemyBoard = document.querySelector("#enemy-board");
  const carrier = document.querySelector("#ship1");
  const battleship = document.querySelector("#ship2");
  const cruiser = document.querySelector("#ship3");
  const pvcBtn = document.querySelector("#pvc-btn");
  const resetBtn = document.querySelector("#reset-btn");
  const pvpBtn = document.querySelector("#pvp-btn");
  const overlay = document.querySelector("#turn-overlay");
  const turnMessage = document.querySelector("#turn-message");
  const startTurnBtn = document.querySelector("#start-turn-btn");
  let gamePhase = "idle";
  let gameMode = null;
  let currentTurn = "player1";
  let placingPlayer = 1;
  let currentlyDraggedShipLength;
  let shipsPlaced = 0;
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
    if (gameMode === "pvp") {
      if (gamePhase === "placing") {
        if (placingPlayer === 1) {
          renderBoard(gameController.player1.gameboard, playerBoard);
        } else {
          renderBoard(gameController.player2.gameboard, playerBoard);
        }

        enemyBoard.innerHTML = "";
        return;
      }

      if (currentTurn === "player1") {
        renderBoard(gameController.player1.gameboard, playerBoard);
        renderBoard(gameController.player2.gameboard, enemyBoard, true);
      } else {
        renderBoard(gameController.player2.gameboard, playerBoard);
        renderBoard(gameController.player1.gameboard, enemyBoard, true);
      }
    } else {
      renderBoard(gameController.player1.gameboard, playerBoard);
      renderBoard(gameController.player2.gameboard, enemyBoard, true);
    }
  }

  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "r") {
      orientation = orientation === "horizontal" ? "vertical" : "horizontal";
    }
    console.log("orientation:", orientation);
  });

  enemyBoard.addEventListener("click", (e) => {
    console.log(gamePhase);
    if (gamePhase !== "playing") return;
    if (!e.target.classList.contains("cell")) return;

    const x = Number(e.target.dataset.x);
    const y = Number(e.target.dataset.y);

    const enemyBoardState =
      gameMode === "pvp" && currentTurn === "player2"
        ? gameController.player1.gameboard
        : gameController.player2.gameboard;

    if (enemyBoardState.attackedCoordinates.some((c) => c.x === x && c.y === y)) return;

    const wasHit = enemyBoardState.ships.some((ship) =>
      ship.coordinates.some((c) => c.x === x && c.y === y)
    );

    if (gameMode === "pvp") {
      enemyBoardState.receiveAttack(x, y);
    } else {
      gameController.playerAttack(x, y);
    }

    let winner = gameController.checkWinner();
    if (winner) {
      renderGame();
      enemyBoard.style.pointerEvents = "none";
      setTimeout(() => {
        alert("Game over!");
      }, 1);
      return;
    }

    if (gameMode === "pvp") {
      if (!wasHit) {
        currentTurn = currentTurn === "player1" ? "player2" : "player1";

        showTurnOverlay(currentTurn, () => {
          renderGame();
        });

        return;
      }
    } else {
      if (!wasHit) {
        let hit;

        do {
          hit = gameController.computerMove();
        } while (hit);
      }
    }

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

    const currentBoard =
      gameMode === "pvp" && placingPlayer === 2
        ? gameController.player2.gameboard
        : gameController.player1.gameboard;

    const overlapCheck = previewShipCoords.some((coord) =>
      currentBoard.ships.some((ship) =>
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

  playerBoard.addEventListener("dragleave", () => {
    playerBoard.querySelectorAll(".preview, .invalid").forEach((cell) => {
      cell.classList.remove("preview", "invalid");
    });
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

        playerBoard.querySelectorAll(".preview, .invalid").forEach((cell) => {
          cell.classList.remove("preview", "invalid");
        });

        return;
      }
    }

    if (orientation === "vertical") {
      if (y + currentlyDraggedShipLength > 10) {
        console.log("Ship was placed out of bounds.");

        playerBoard.querySelectorAll(".preview, .invalid").forEach((cell) => {
          cell.classList.remove("preview", "invalid");
        });

        return;
      }
    }

    const currentBoard =
      gameMode === "pvp" && placingPlayer === 2
        ? gameController.player2.gameboard
        : gameController.player1.gameboard;

    const overlapCheck = newShipCoords.some((coord) =>
      currentBoard.ships.some((ship) =>
        ship.coordinates.some((existing) => existing.x === coord.x && existing.y === coord.y)
      )
    );

    if (overlapCheck) {
      console.log("Ships were overlapping.");

      playerBoard.querySelectorAll(".preview, .invalid").forEach((cell) => {
        cell.classList.remove("preview", "invalid");
      });

      return;
    }

    currentBoard.placeShip(new Ship(currentlyDraggedShipLength), newShipCoords);

    if (currentlyDraggedShipLength === 5) carrier.style.display = "none";
    else if (currentlyDraggedShipLength === 4) battleship.style.display = "none";
    else cruiser.style.display = "none";

    currentlyDraggedShipLength = null;
    orientation = "horizontal";

    playerBoard.querySelectorAll(".preview, .invalid").forEach((cell) => {
      cell.classList.remove("preview", "invalid");
    });

    shipsPlaced++;

    if (shipsPlaced === 3) {
      if (gameMode === "pvp") {
        if (placingPlayer === 1) {
          placingPlayer = 2;
          shipsPlaced = 0;

          showTurnOverlay("player2", () => {
            carrier.style.display = "flex";
            battleship.style.display = "flex";
            cruiser.style.display = "flex";

            renderGame();
          });

          return;
        } else {
          gamePhase = "playing";
          currentTurn = "player1";

          showTurnOverlay("player1");
        }
      } else {
        gamePhase = "playing";
      }
    }

    renderGame();
  });

  carrier.addEventListener("dragstart", () => {
    console.log("started dragging carrier");
    currentlyDraggedShipLength = 5;
  });

  battleship.addEventListener("dragstart", () => {
    console.log("started dragging battleship");
    currentlyDraggedShipLength = 4;
  });

  cruiser.addEventListener("dragstart", () => {
    console.log("started dragging cruiser");
    currentlyDraggedShipLength = 3;
  });

  pvcBtn.addEventListener("click", () => {
    gamePhase = "placing";

    gameMode = "pvc";

    gameController.setupComputerShips();

    carrier.style.display = "flex";
    battleship.style.display = "flex";
    cruiser.style.display = "flex";

    resetGame();
    renderGame();
  });

  pvpBtn.addEventListener("click", () => {
    gameMode = "pvp";
    gamePhase = "placing";
    placingPlayer = 1;

    carrier.style.display = "flex";
    battleship.style.display = "flex";
    cruiser.style.display = "flex";

    resetGame();
    renderGame();
  });

  function resetGame() {
    gameController.player1.gameboard.ships = [];
    gameController.player1.gameboard.missedAttacks = [];
    gameController.player1.gameboard.attackedCoordinates = [];

    gameController.player2.gameboard.ships = [];
    gameController.player2.gameboard.missedAttacks = [];
    gameController.player2.gameboard.attackedCoordinates = [];

    currentlyDraggedShipLength = null;
    orientation = "horizontal";
    shipsPlaced = 0;
    gamePhase = "placing";

    placingPlayer = 1;

    enemyBoard.style.pointerEvents = "";
    carrier.style.display = "flex";
    battleship.style.display = "flex";
    cruiser.style.display = "flex";

    if (gameMode === "pvc") {
      gameController.setupComputerShips();
    }

    renderGame();
  }

  resetBtn.addEventListener("click", () => {
    resetGame();
  });

  function showTurnOverlay(nextPlayer, onConfirm) {
    playerBoard.innerHTML = "";
    enemyBoard.innerHTML = "";

    overlay.classList.remove("hidden");
    turnMessage.textContent =
      nextPlayer === "player1" ? "Player 1: Your turn" : "Player 2: Your turn";

    startTurnBtn.onclick = null;

    startTurnBtn.onclick = () => {
      hideTurnOverlay();

      if (onConfirm) {
        onConfirm();
      } else {
        renderGame();
      }
    };
  }

  function hideTurnOverlay() {
    overlay.classList.add("hidden");
  }

  return { renderGame };
})();

export default domController;
