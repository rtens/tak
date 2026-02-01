import Board from './board.js'

export default class Game {

  constructor(size) {
    this.board = new Board(size)
    this.plays = []
  }

  perform(play) {
    this.board.apply(play)
    this.plays.push(play)
  }
}