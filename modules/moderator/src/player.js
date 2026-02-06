export default class Player {

  constructor(mod) {
    this.mod = mod
  }

  name() {
    return 'Unknown'
  }

  async play(_game) {
    return null
  }

  over(_game) {

  }
}