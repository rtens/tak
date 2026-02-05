import Place from '../../../game/src/place.js'
import Player from '../../../moderator/src/player.js'

export default class Cli extends Player {

  constructor(mod, name) {
    super(mod)
    this.name = () => name
  }

  async play() {
    await this.mod.user.ask('Play')
    return Place.Flat.at(0, 0)
  }
}