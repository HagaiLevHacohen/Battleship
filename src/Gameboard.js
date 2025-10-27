import { Ship } from "./Ship";
import { Direction } from "./Direction";

class Gameboard {
    #boardLength;
    #board;
    #ships;
    #successfulHitsList;
    #missedHitsList;

    constructor(boardLength = 10) {
        this.#boardLength = boardLength;
        this.#board = Array.from({ length: this.boardLength }, () => Array(this.boardLength).fill(null)); // boardLength x boardLength array
        this.#ships = [];
        this.#successfulHitsList = [];
        this.#missedHitsList = [];
    }

    get missedHitsList() {
    return [...this.#missedHitsList];
    }

    get successfulHitsList() {
        return [...this.#successfulHitsList];
    }


    get boardLength() {
        return this.#boardLength;
    }

    getCell(i, j) {
        return this.#board[i][j]
    }

    placeShip(length, i, j, direction) { // i'th row, j'th column
        if (direction === Direction.HORIZONTAL) {
            if (j + length > this.boardLength){
                throw new Error("Invalid ship placement: out-of-bounds");
            }
        }
        else { // Vertical
            if (i + length > this.boardLength){
                throw new Error("Invalid ship placement: out-of-bounds");
            }
        }

        // Check for overlapping ships
        for (let k = 0; k < length; k++) {
            const row = direction === Direction.HORIZONTAL ? i : i + k;
            const col = direction === Direction.HORIZONTAL ? j + k : j;

            if (this.#board[row][col] !== null) {
                throw new Error("Invalid ship placement: overlapping another ship");
            }
        }

        const ship = new Ship(length);
        this.#ships.push(ship);
        if (direction === Direction.HORIZONTAL) {
            for(let k = 0; k < length; k++){
                this.#board[i][j + k] = ship;
            }
        }
        else { // Vertical
            for(let k = 0; k < length; k++){
                this.#board[i + k][j] = ship;
            }
        }
    }

    receiveAttack(i, j) {
        // Check if this coordinate has already been attacked
        if (
            this.#missedHitsList.some(hit => hit.row === i && hit.col === j) ||
            this.#successfulHitsList.some(hit => hit.row === i && hit.col === j)
        ) {
            throw new Error("This coordinate has already been attacked");
        }
        // Check if the coordinate is out-of-bounds
        if (i < 0 || i >= this.#boardLength || j < 0 || j >= this.#boardLength) {
            throw new Error("Invalid attack: coordinates out of bounds");
        }


        if (this.#board[i][j] === null) {
            this.#missedHitsList.push({row: i, col: j});
        }
        else {
            this.#successfulHitsList.push({row: i, col: j});
            this.#board[i][j].hit();
        }
    }

    areAllShipsSunk() {
        return this.#ships.every(ship => ship.isSunk());
    }

}

export {Gameboard};