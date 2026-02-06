import Player from '../../src/player.js'

export default class MockPlayer extends Player {

  constructor(_mod, name) {
    super()
    this.name = () => name
  }

  async play(game) {
    this.constructor.playing = game
    return null
  }

  over() { }

  static playing(...plays) {
    return class extends MockPlayer {
      play(game) {
        super.play(game)
        return plays.shift()
      }
    }
  }

  static importer() {
    return () => ({
      default: this
    })
  }
}
