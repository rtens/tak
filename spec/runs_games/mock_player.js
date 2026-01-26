import Place from '../../src/model/place.js'
import Player from '../../src/player.js'
import parse from '../../src/model/parse.js'

export default class MockPlayer extends Player {

  constructor(runner, name) {
    super(runner)
    this.name = () => name
  }

  static import() {
    return () => ({
      default: this
    })
  }

  play(game) {
    return Place.Flat.at(
      game.plays.length % game.board.size,
      Math.floor(game.plays.length / game.board.size))
  }
}

MockPlayer.playing = plays =>
  class extends MockPlayer {
    play() {
      const play = plays.shift()
      return play ? parse(play) : null
    }
  }