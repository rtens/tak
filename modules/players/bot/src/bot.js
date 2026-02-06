import Player from '../../../moderator/src/player.js'
import Place from '../../../game/src/place.js'
import Coords from '../../../game/src/coords.js'
import LegalPlays from './legal_plays.js'
import { Win } from '../../../game/src/result.js'

const GAME_OVER = 9000

export default class Bot extends Player {

  constructor(mod, level) {
    super(mod)
    this.random = Math.random
    this.level = level ? parseInt(level) : 2
  }

  name() {
    return 'Bot'
  }

  async play(game) {
    if (game.plays.length < 2)
      return this.opening(game.board)

    return this.best(game.board)
  }

  opening(board) {
    const s = board.size - 1
    const corners = [
      new Coords(0, 0),
      new Coords(s, s),
    ]

    const empty_corner = corners.find(c => board.square(c).empty())

    return new Place.Flat(empty_corner)
  }

  best(board) {
    const plays = this.best_plays(board, this.level)
    return plays[Math.floor(this.random() * plays.length)]
  }

  best_plays(board, depth) {
    let plays = []
    let best = -Infinity

    for (const play of this.legals(board)) {

      board.apply(play)
      const score = -this.search(board, depth)
      board.revert(play)

      if (score == best) {
        plays.push(play)

      } else if (score > best) {
        best = score
        plays = [play]
      }
    }

    return plays
  }

  search(board, depth) {
    const game_over = board.game_over()
    if (game_over instanceof Win)
      return game_over.color == board.turn
        ? GAME_OVER
        : -GAME_OVER

    if (!depth)
      return this.evaluate(board)

    let best = -Infinity
    for (const play of this.legals(board)) {

      board.apply(play)
      const score = -this.search(board, depth - 1)
      board.revert(play)

      if (score > best)
        best = score
    }

    return best
  }

  evaluate(board) {
    return 0
  }

  legals(board) {
    return new LegalPlays(board).generate()
  }
}