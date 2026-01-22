import { parse } from '../model/play.js'
import Player from '../player.js'

export default class Cli extends Player {

  constructor(runner, name) {
    super(runner)
    this.name = () => name
  }

  async start() {
    this.runner.interface.print('Press enter to see the board')
  }

  async play(game) {
    let input = await this.runner.interface.read('Your play:')

    while (typeof input == 'string') {
      if (input) return parse(input)


      this.runner.interface.print(game.board.print())
      input = await this.runner.interface.read('Your play:')
    }
  }
}