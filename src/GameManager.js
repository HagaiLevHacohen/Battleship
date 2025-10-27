import { Direction } from "./Direction";

class GameManager {
  player;
  computer;
  ui;
  currentTurn;
  boardLen;
  availableMoves;

  constructor(player, computer, ui, boardLen) {
    this.player = player;
    this.computer = computer;
    this.ui = ui;
    this.boardLen = boardLen;
    this.currentTurn = "player";
  }

  run() {
    // Pregame setup
    this.generateComputerShips();
    this.availableMoves = this.generateShuffledMoves();
    this.ui.renderBoard(this.player);
    this.ui.pregameSetHandlers(this.player, () => {
      console.log("All ships placed — starting game!");
      this.startGame();
    });
  }

  generateComputerShips() {
    const placementQueue = [5, 4, 3, 3, 2];
    while (placementQueue.length !== 0) {
      let shipLength = placementQueue.shift();
      let placed = false;
      while (!placed) {
        try {
          // Generate random row (0–9)
          const row = Math.floor(Math.random() * 10);
          // Generate random col (0–9)
          const col = Math.floor(Math.random() * 10);
          // Generate random direction (0 = horizontal, 1 = vertical)
          const directionNumber = Math.floor(Math.random() * 2);
          const direction = directionNumber
            ? Direction.VERTICAL
            : Direction.HORIZONTAL;

          this.computer.gameboard.placeShip(shipLength, row, col, direction);
          placed = true;
        } catch (e) {
          // If placement fails (e.g. invalid position, overlap), try again
          continue;
        }
      }
    }
  }

  startGame() {
    this.ui.renameTitle("Your turn!");
    this.ui.displayComputerBoard();
    this.ui.renderBoard(this.player);
    this.ui.renderBoard(this.computer);

    // Add listeners to all the cells of the computer board
    this.ui.enablePlayerAttacks((row, col) => this.handlePlayerShot(row, col));
  }

  handlePlayerShot(row, col) {
    if (this.currentTurn !== "player") return;

    try {
      this.computer.gameboard.receiveAttack(row, col);
    } catch (error) {
      alert(error.message);
      return;
    }
    this.ui.renderBoard(this.computer);
    this.ui.enablePlayerAttacks((row, col) => this.handlePlayerShot(row, col)); // reapply listeners to all the computer's cells

    if (this.computer.gameboard.areAllShipsSunk()) {
      this.ui.renameTitle("You win!");
      this.ui.renderBoard(this.computer);
      this.ui.renderBoard(this.player);
      return;
    }

    // Disable clicking while the computer moves (optional UX improvement)
    this.currentTurn = "computer";
    this.ui.renameTitle("Computer's turn!");

    // Small delay for realism
    setTimeout(() => {
      this.computerMove();
    }, 500);
  }

  computerMove() {
    const randomAttack = this.getRandomMove();
    this.player.gameboard.receiveAttack(randomAttack.row, randomAttack.col);
    this.ui.renderBoard(this.player);

    if (this.player.gameboard.areAllShipsSunk()) {
      this.ui.renameTitle("Computer wins!");
      this.ui.renderBoard(this.computer);
      this.ui.renderBoard(this.player);
      return;
    }

    this.currentTurn = "player";
    this.ui.renameTitle("Your turn!");
  }

  generateShuffledMoves() {
    const moves = [];
    for (let row = 0; row < this.boardLen; row++) {
      for (let col = 0; col < this.boardLen; col++) {
        moves.push({ row: row, col: col });
      }
    }
    return GameManager.shuffle(moves);
  }
  static shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  getRandomMove() {
    return this.availableMoves.pop(); // take the next random unused move
  }
}

export { GameManager };
