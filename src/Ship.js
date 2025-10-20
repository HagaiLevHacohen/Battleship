class Ship {
    #length;
    #hitNumber = 0;
    #sunk = false;

    constructor(length) {
        if (typeof length !== 'number' || length <= 0) {
            throw new Error('Ship length must be a number greater than 0.');
        }
        this.#length = length;
    }

    get length() {
        return this.#length;
    }

    get hitNumber() {
        return this.#hitNumber;
    }

    hit() {
        this.#hitNumber++;
    }

    isSunk() {
        if(this.#sunk || this.#hitNumber >=  this.#length) {
            this.#sunk = true;
            return true;
        }
        return false;
    }
}

export {Ship};