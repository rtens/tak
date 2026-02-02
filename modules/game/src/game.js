import Board from './board.js'
import Place from './place.js'

export default class Game {

  constructor(size) {
    this.board = new Board(size)
    this.plays = []
  }

  perform(play) {
    if (this.plays.length < 2 && !(play instanceof Place.Flat))
      throw new Error('Must place flat')

    this.board.apply(play)
    this.plays.push(play)
  }
}