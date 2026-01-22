import Board from './board.js'
import Place from './place.js'
import { Stone } from './piece.js'
import { Draw, FlatWin, Forfeit, RoadWin } from './result.js'

export default class Game {

  constructor(board_size = 5) {
    this.board = new Board(board_size)
    this.plays = []
  }

  forfeit(color) {
    this.forfeited = color == 'white' ? 'black' : 'white'
  }

  result() {
    if (this.forfeited) {
      return new Forfeit(this.forfeited)
    }

    const road = this.board.road()
    if (road) {
      return new RoadWin(road[0].top().color)
    }

    if (this.board.filled()
      || this.board.white.empty() && this.board.black.empty()
    ) {
      const { white, black } = this.flat_count()

      if (white > black) {
        return new FlatWin('white')
      } else if (black > white) {
        return new FlatWin('black')
      } else {
        return new Draw()
      }
    }
  }

  turn() {
    return this.plays.length % 2 == 0
      ? 'white'
      : 'black'
  }

  perform(play) {
    let color = this.turn()

    if (this.plays.length < 2) {
      if (!(play instanceof Place.Flat)) {
        throw new Error('First two plays must place flats')
      }

      color = this.plays.length
        ? 'white'
        : 'black'
    }

    const clone = this.board.clone()
    play.apply(clone, color)
    this.board = clone
    this.plays.push(play)
  }

  flat_count() {
    const counts = { white: 0, black: 0 }
    for (const square of Object.values(this.board.squares)) {
      const top = square.top()
      if (top instanceof Stone && !top.standing) {
        counts[top.color]++
      }
    }
    return counts
  }

  clone() {
    const game = new Game()
    game.board = this.board.clone()
    game.plays = [...this.plays]
    return game
  }

  ptn() {
    const turns = []
    for (let p = 0; p < this.plays.length; p += 2) {
      const parts = [turns.length + 1 + '.']
      parts.push(this.plays[p].ptn())
      if (this.plays[p + 1]) parts.push(this.plays[p + 1].ptn())
      turns.push(parts.join(' '))
    }

    return [
      '[Site "takbot"]',
      '[Event "Local Play"]',
      `[Date "${new Date().toISOString().slice(0, 10)}"]`,
      `[Time "${new Date().toISOString().slice(11)}"]`,
      '[Player1 "Unknown"]',
      '[Player2 "Unknown"]',
      '[Clock "none"]',
      `[Result "${this.result().ptn()}"]`,
      `[Size "${this.board.size}"]`,
      '',
      ...turns,
      this.result().ptn()
    ].join('\n')
  }
}
