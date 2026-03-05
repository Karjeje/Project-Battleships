import Gameboard from "./Gameboard";

class Player {
  constructor(type = "human") {
    this.gameboard = new Gameboard();
    this.type = type;
  }
}

export default Player;
