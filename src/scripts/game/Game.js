import { Scene } from "../system/Scene";
import { Board } from "./Board";
import { App } from "../system/App";
import { CombinationManager } from "../system/CombinationManager";

export class Game extends Scene {
  create() {
    this.createBackground();
    this.board = new Board();
    this.container.addChild(this.board.container);
    this.board.container.on('tile-touch-start', this.onTileClick.bind(this));
    this.combinationManager = new CombinationManager(this.board)
    this.checking = true
    this.matchesCheck()
  }

  createBackground() {
    this.bg = App.sprite("bg");
    this.bg.width = window.innerWidth;
    this.bg.height = window.innerHeight;
    this.container.addChild(this.bg);
  }

  onTileClick(tile) {
    if (this.disabled) return

    if (this.selectedTile) {
      if (this.selectedTile.isNeighbor(tile)) {
        this.swap(this.selectedTile, tile);
      }
      else {
        this.clearSelection()
        this.selectTile(tile)
      }
    } else {
      this.selectTile(tile)
    }
  }

  selectTile(tile) {
    this.selectedTile = tile
    this.selectedTile.field.select()
  }

  clearSelection() {
    if (this.selectedTile) {
      this.selectedTile.field.unselect()
      this.selectedTile = null
    }
  }

  matchesCheck() {
    this.checking == true
    return new Promise(resolve => {
      let matches = []
      matches = this.combinationManager.getMatches()
      if (matches.length) {
        this.processMatches(matches).then(this.matchesCheck.bind(this))
        return
      }

      this.checking = false
      resolve(!!matches.length)
    })
  }

  swap(selectedTile, tile, reverse = false) {
    this.disabled = true
    this.clearSelection()

    selectedTile.sprite.zIndex = 2
    selectedTile.moveTo(tile.field.position, 0.2)

    tile.moveTo(selectedTile.field.position, 0.2).then(() => {
      this.board.swap(selectedTile, tile, false)

      if (!reverse) {
        this.matchesCheck().then((isValid) => {
          if (!isValid) {
            this.swap(selectedTile, tile, true)
          }
        })
      }
      this.disabled = false
    })
  }

  processMatches(matches) {
    return new Promise(resolve => {
      this.removeMatches(matches);
      this.processFallDown().then(() => {
        setTimeout(() => {
          this.board.refill()
          resolve()
        }, 100)
      });
    })
  }

  removeMatches(matches) {
    matches.forEach(match => {
      match.forEach(tile => {
        tile.remove();
      });
    });
  }

  processFallDown() {
    return new Promise(resolve => {
      let completed = 0
      let started = 0

      for (let row = this.board.rows - 1; row >= 0; row--) {
        for (let col = this.board.cols - 1; col >= 0; col--) {
          const field = this.board.getField(row, col);

          if (field.isEmpty) {
            ++started;

            // shift all tiles that are in the same column in all rows above
            this.fallDownTo(field).then(() => {
              ++completed;
              if (completed >= started) {
                resolve();
              }
            });
          }
        }
      }
    })
  }

  fallDownTo(emptyField) {
    for (let row = emptyField.row - 1; row >= 0; row--) {
      let fallingField = this.board.getField(row, emptyField.col);

      if (!fallingField.isEmpty) {
        const fallingTile = fallingField.tile;
        fallingTile.field = emptyField;
        emptyField.tile = fallingTile;
        fallingField.tile = null;
        return fallingTile.fallDownTo(emptyField.position, 0.3 + 0.05 * (row + 1));
      }
    }

    return Promise.resolve();
  }
}
