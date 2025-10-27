import "./styles.css"
import { Player } from "./Player";
import { UIController } from "./UIController";
import { GameManager } from "./GameManager";

const player = new Player(false);
const computer = new Player(true);

const boardLen = player.gameboard.boardLength;

const ui = new UIController(
  document.querySelector('#player-board'),
  document.querySelector('#computer-board'),
  boardLen
);

const game = new GameManager(player, computer, ui, boardLen);
game.run();