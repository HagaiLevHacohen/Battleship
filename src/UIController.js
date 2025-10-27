import { Direction } from "./Direction";

class UIController {
  playerBoardElement;
  computerBoardElement;
  placementDirection = Direction.VERTICAL;
  placementQueue = [5, 4, 3, 3, 2];
  previewCells;
  currentHoverIndex;
  boardLen;

  constructor(playerBoardElement, computerBoardElement, boardLen) {
    this.playerBoardElement = playerBoardElement;
    this.computerBoardElement = computerBoardElement;
    this.boardLen = boardLen;
    // Listen for key presses globally
    window.addEventListener('keydown', (e) => this.handleKeyPress(e));
  }

  get placementLength() {
    return this.placementQueue[0];
  }

  displayComputerBoard() {
    const board = document.querySelector('#computer-board');
    board.style.display = 'grid';
  }

  handleKeyPress(event) {
    if (event.key.toUpperCase() === 'D') {
      // Toggle direction
      this.placementDirection =
        this.placementDirection === Direction.VERTICAL
          ? Direction.HORIZONTAL
          : Direction.VERTICAL;

      // If there are currently preview cells, update them
      if (this.currentHoverIndex !== undefined) {
        this.clearPreview();
        this.showPreviewFromIndex(this.currentHoverIndex);
      }
    }
  }

  renderBoard(player) {
    if (player.isComputer) {
      this.computerBoardElement.innerHTML = '';
      const board = player.gameboard;

      // Adding the cells children
      for (let i = 0; i < board.boardLength; i++) {
        for (let j = 0; j < board.boardLength; j++) {
          const cell = document.createElement('div');
          cell.classList.add('cell');
          cell.setAttribute('data-index', i*10 + j); // set the data-index attribute
          this.computerBoardElement.appendChild(cell);
        }
      }

      // Adding  the hits
      for (let hit of board.successfulHitsList){
        const dataIndex = hit.row * 10 + hit.col;
        const cell = this.computerBoardElement.querySelector(`[data-index="${dataIndex}"]`);
        cell.classList.add('hit');
        cell.textContent = 'X';
      }

      // Adding  the misses
      for (let miss of board.missedHitsList){
        const dataIndex = miss.row * 10 + miss.col;
        const cell = this.computerBoardElement.querySelector(`[data-index="${dataIndex}"]`);
        cell.classList.add('miss');
        cell.textContent = '*';
      }
    }
    else {
      this.playerBoardElement.innerHTML = '';
      const board = player.gameboard;

      // Adding the cells children
      for (let i = 0; i < board.boardLength; i++) {
        for (let j = 0; j < board.boardLength; j++) {
          const cell = document.createElement('div');
          cell.classList.add('cell');
          cell.setAttribute('data-index', i*10 + j); // set the data-index attribute

          const ship = board.getCell(i, j);
          if (ship !== null){
            if (ship.length === 5) {
              cell.classList.add('carrier');
            }
            else if (ship.length === 4) {
              cell.classList.add('battleship');
            }
            else if (ship.length === 3) {
              cell.classList.add('submarine');
            }
            else if (ship.length === 2) {
              cell.classList.add('destroyer');
            }
          }

          this.playerBoardElement.appendChild(cell);
        }
      }

      // Adding  the hits
      for (let hit of board.successfulHitsList){
        const dataIndex = hit.row * 10 + hit.col;
        const cell = this.playerBoardElement.querySelector(`[data-index="${dataIndex}"]`);
        cell.classList.add('hit');
        cell.textContent = 'X';
      }

      // Adding  the misses
      for (let miss of board.missedHitsList){
        const dataIndex = miss.row * 10 + miss.col;
        const cell = this.playerBoardElement.querySelector(`[data-index="${dataIndex}"]`);
        cell.classList.add('miss');
        cell.textContent = '*';
      }
    }
  }

  pregameSetHandlers(player, onPlacementComplete) {
    const cells = this.playerBoardElement.querySelectorAll('.cell');

    cells.forEach(cell => {
      // Click to place the ship
      cell.addEventListener('click', (e) => this.pregameClickHandler(e, player, onPlacementComplete));

      // Hover to show placement preview
      cell.addEventListener('mouseenter', (e) => {
        const datasetIndex = e.target.dataset.index;
        this.currentHoverIndex = parseInt(datasetIndex); // store current hover
        this.showPreviewFromIndex(datasetIndex);
      });
      cell.addEventListener('mouseleave', () => this.clearPreview());
    });
  }

  pregameClickHandler(event, player, onPlacementComplete) {
    const datasetIndex = event.target.dataset.index;
    const row = Math.floor(datasetIndex / 10);
    const col = datasetIndex % 10;

    try {
      player.gameboard.placeShip(this.placementLength, row, col, this.placementDirection);
      // Remove the placed ship from the queue
      this.placementQueue.shift();

      if (this.placementQueue.length === 0) {
        // All ships placed
        this.playerBoardElement.innerHTML = '';
        onPlacementComplete();
      } else {
        // Re-render board so next ship shows up
        this.renderBoard(player);
        this.pregameSetHandlers(player, onPlacementComplete);
      }
    }
    catch (error) {
      alert(error.message);
    }
  }

  showPreviewFromIndex(datasetIndex) {
    if (datasetIndex === undefined) return;

    const row = Math.floor(datasetIndex / 10);
    const col = datasetIndex % 10;

    this.previewCells = [];

    for (let k = 0; k < this.placementLength; k++) {
      const r = this.placementDirection === Direction.HORIZONTAL ? row : row + k;
      const c = this.placementDirection === Direction.HORIZONTAL ? col + k : col;

      // Check bounds
      if (r >= this.boardLen || c >= this.boardLen) break;

      const cell = this.playerBoardElement.querySelector(`[data-index="${r*10 + c}"]`);
      if (cell) {
        cell.classList.add('preview');
        this.previewCells.push(cell);
      }
    }
  }

  clearPreview() {
    if (!this.previewCells) return;

    this.previewCells.forEach(cell => cell.classList.remove('preview'));
    this.previewCells = [];
  }

  enablePlayerAttacks(onCellClick) {
    const cells = this.computerBoardElement.querySelectorAll('.cell');
    cells.forEach((cell) => {
      const datasetIndex = parseInt(cell.dataset.index);
      if (datasetIndex === undefined) return;
      const row = Math.floor(datasetIndex / 10);
      const col = datasetIndex % 10;

      cell.addEventListener('click', () => {
          onCellClick(row, col);
      });
    });
  }

  renameTitle(content) {
    const title = document.querySelector('.game > h1');
    title.textContent = content;
  }
}

export {UIController};