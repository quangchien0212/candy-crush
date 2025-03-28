import { Tools } from "../system/Tools";
import { Game } from "./Game";

export const Config = {
  loader: Tools.massiveRequire(require["context"]('./../../sprites/', true, /\.(mp3|png|jpe?g)$/)),
  startScene: Game,
  scenes: {
    "Game": Game
  },
  board: {
    rows: 6,
    cols: 6,
  },
  tilesColors: ["green", "blue", "yellow", "red", "pink", "orange"],
  combinationRules: [[
    { col: 1, row: 0 }, { col: 2, row: 0 },
  ], [
    { col: 0, row: 1 }, { col: 0, row: 2 },
  ]]
};