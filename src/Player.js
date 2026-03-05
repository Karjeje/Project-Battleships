import Gameboard from "./Gameboard";

class Player {
  constructor(type = "human") {
    this.gameboard = new Gameboard();
  }
}

export default Player;
