import { Gameboard } from "./Gameboard";

class Player {
  #isComputer;
  #gameboard;

  constructor(isComputer = false) {
    this.#isComputer = isComputer;
    this.#gameboard = new Gameboard();
  }

  get isComputer() {
    return this.#isComputer;
  }

  get gameboard() {
    return this.#gameboard;
  }
}

export { Player };
