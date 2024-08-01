import { App } from "./App";

export class CombinationManager {
  constructor(board) {
    this.board = board
  }

  getMatches() {
    let result = []

    this.board.fields.forEach(checkingField => {
      App.config.combinationRules.forEach(rule => {
        let matches = [checkingField.tile]

        rule.forEach(p => {
          const row = checkingField.row + p.row
          const col = checkingField.col + p.col

          const comparingField = this.board.getField(row, col)

          if (!comparingField || !comparingField.tile) return

          if (!checkingField.tile) return

          if (comparingField.tile.color == checkingField.tile.color) {
            matches.push(comparingField.tile)
          }
        })

        if (matches.length == rule.length + 1) {
          result.push(matches)
        }
      })
    })

    return result
  }
}