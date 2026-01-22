import Coords from './coords.js'

export default class Play {

  constructor(coords) {
    this.coords = coords
  }

  static at(file, rank) {
    return new this(new Coords(file, rank))
  }

  apply(_board, _color) {
    throw new Error('not implemented')
  }

  ptn() {
    throw new Error('not implemented')
  }
}