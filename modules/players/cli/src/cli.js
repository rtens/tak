import Player from '../../../moderator/src/player.js'
import parse from './parse.js'
import print_board from './print_board.js'

export default class Cli extends Player {

  constructor(mod, name) {
    super(mod)
    this.name = () => name || 'nemo'
  }

  async play(game) {
    let input = await this.mod.user.ask('Your play:')

    while (typeof input == 'string') {
      if (input) return parse(input)

      this.mod.user.tell(print_board(game.board, this.mod.paint))
      input = await this.mod.user.ask('Your play:')
    }

    return input
  }

  over(game) {
    this.mod.user.tell(print_board(game.board, this.mod.paint))
  }
}

