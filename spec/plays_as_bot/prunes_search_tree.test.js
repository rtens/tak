import test from 'ava'
import Bot from '../../src/players/bot.js'
import Board from '../../src/model/board.js'

test('comparison', t => {
  const board = new Board(3)

  class MyBot extends Bot {
    searched = {}

    constructor(pruning) {
      super(null, 2)
      this.pruning = pruning
    }
    best_plays(board, depth) {
      if (depth < 2) return []
      return super.best_plays(board, depth)
    }

    search(board, depth, alpha, beta) {
      this.searched[depth] ||= 0
      this.searched[depth]++
      return super.search(board, depth, alpha, beta)
    }
  }

  const not_pruning = new MyBot(false)
  const pruning = new MyBot(true)

  not_pruning.best_play(board)
  pruning.best_play(board)

  t.assert(pruning.searched[2] == not_pruning.searched[2])
  t.assert(pruning.searched[1] <= not_pruning.searched[1])
  t.assert(pruning.searched[0] < not_pruning.searched[0] / 5)
})