import { Ship } from "./Ship";

test("Ship constructor - throws an error if length is 0", () => {
  expect(() => new Ship(0)).toThrow(
    "Ship length must be a number greater than 0.",
  );
});

test("Ship constructor - throws an error if length is negative", () => {
  expect(() => new Ship(-5)).toThrow(
    "Ship length must be a number greater than 0.",
  );
});

test("Ship constructor - throws an error if length is not a number", () => {
  expect(() => new Ship("cat")).toThrow(
    "Ship length must be a number greater than 0.",
  );
});

test("hit function incrementing the hitNumber", () => {
  const ship = new Ship(5);
  expect(ship.hitNumber).toBe(0);
  ship.hit();
  expect(ship.hitNumber).toBe(1);
  ship.hit();
  expect(ship.hitNumber).toBe(2);
});

test("isSunk test", () => {
  const ship = new Ship(2);
  expect(ship.isSunk()).toBe(false);
  ship.hit();
  expect(ship.isSunk()).toBe(false);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
