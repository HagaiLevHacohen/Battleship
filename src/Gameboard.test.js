import { Gameboard } from "./Gameboard";
import { Direction } from "./Direction";

test("placing a ship happy route horizontal", () => {
  const gameBoard = new Gameboard(15);
  gameBoard.placeShip(5, 0, 0, Direction.HORIZONTAL);
  expect(gameBoard.getCell(0, 0)).not.toBe(null);
  expect(gameBoard.getCell(0, 1)).toBe(gameBoard.getCell(0, 4));
  expect(gameBoard.getCell(0, 5)).toBe(null);
});

test("placing a ship happy route vertical", () => {
  const gameBoard = new Gameboard(15);
  gameBoard.placeShip(5, 0, 0, Direction.VERTICAL);
  expect(gameBoard.getCell(0, 0)).not.toBe(null);
  expect(gameBoard.getCell(1, 0)).toBe(gameBoard.getCell(4, 0));
  expect(gameBoard.getCell(5, 0)).toBe(null);
});

test("placing a ship out of bound error", () => {
  const gameBoard = new Gameboard();
  expect(() =>
    gameBoard.placeShip(gameBoard.boardLength + 1, 0, 0, Direction.HORIZONTAL),
  ).toThrow("Invalid ship placement: out-of-bounds");
  expect(() =>
    gameBoard.placeShip(2, gameBoard.boardLength - 1, 0, Direction.VERTICAL),
  ).toThrow("Invalid ship placement: out-of-bounds");
  expect(() =>
    gameBoard.placeShip(2, 0, gameBoard.boardLength - 1, Direction.HORIZONTAL),
  ).toThrow("Invalid ship placement: out-of-bounds");
});

test("placing a ship on another ship error", () => {
  const gameBoard = new Gameboard();
  gameBoard.placeShip(5, 0, 2, Direction.VERTICAL);
  expect(() => gameBoard.placeShip(3, 3, 0, Direction.HORIZONTAL)).toThrow(
    "Invalid ship placement: overlapping another ship",
  );
});

test("getCell test", () => {
  const gameBoard = new Gameboard();
  gameBoard.placeShip(5, 0, 0, Direction.HORIZONTAL);
  expect(gameBoard.getCell(0, 0).length).toBe(5);
});

test("receive attack happy route successful hit", () => {
  const gameBoard = new Gameboard();
  gameBoard.placeShip(5, 0, 0, Direction.HORIZONTAL);
  gameBoard.receiveAttack(0, 0);
  expect(gameBoard.successfulHits[0]).toEqual({ row: 0, col: 0 });
  expect(gameBoard.successfulHits.length).toBe(1);
});

test("receive attack happy route missed hit", () => {
  const gameBoard = new Gameboard();
  gameBoard.placeShip(5, 0, 0, Direction.HORIZONTAL);
  gameBoard.receiveAttack(1, 1);
  expect(gameBoard.missedHits[0]).toEqual({ row: 1, col: 1 });
  expect(gameBoard.missedHits.length).toBe(1);
});

test("receive attack hit same spot twice error", () => {
  const gameBoard = new Gameboard();
  gameBoard.receiveAttack(0, 0);
  expect(() => gameBoard.receiveAttack(0, 0)).toThrow(
    "This coordinate has already been attacked",
  );
});

test("receive attack hit is out of bound", () => {
  const gameBoard = new Gameboard();
  expect(() => gameBoard.receiveAttack(10, 0)).toThrow(
    "Invalid attack: coordinates out of bounds",
  );
});

test("is sunk", () => {
  const gameBoard = new Gameboard();
  gameBoard.placeShip(2, 0, 0, Direction.HORIZONTAL);
  gameBoard.placeShip(1, 1, 1, Direction.HORIZONTAL);
  gameBoard.receiveAttack(1, 1);
  expect(gameBoard.areAllShipsSunk()).toBeFalsy();
  gameBoard.receiveAttack(0, 0);
  gameBoard.receiveAttack(0, 1);
  expect(gameBoard.areAllShipsSunk()).toBeTruthy();
});
