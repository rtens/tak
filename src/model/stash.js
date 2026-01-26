import { Cap, Stone } from './piece.js'
import Stack from './stack.js'

export default class Stash {

  constructor() {
    this.stones = []
    this.caps = []
  }

  starting(color, stones, caps) {
    const opponent = color == 'white' ? 'black' : 'white'
    this.add_stones(color, stones - 1)
    this.add_stones(opponent, 1)
    this.add_caps(color, caps)

    return this
  }

  add_stones(color, number) {
    for (let n = 0; n < number; n++)
      this.stones.push(new Stone(color))
  }

  add_caps(color, number) {
    for (let n = 0; n < number; n++)
      this.caps.push(new Cap(color))
  }

  take_flat() {
    if (!this.stones.length) {
      throw new Error('No stones left')
    }
    return Stack.of(this.stones.pop())
  }

  take_wall() {
    if (!this.stones.length)
      throw new Error('No stones left')

    return Stack.of(this.stones.pop().stand())
  }

  take_cap() {
    if (!this.caps.length)
      throw new Error('No caps left')

    return Stack.of(this.caps.pop())
  }

  put(stack) {
    for (const piece of stack.pieces) {
      if (piece instanceof Stone) {
        this.stones.push(piece.flat())
      } else {
        this.caps.push(piece)
      }
    }
  }

  count() {
    return this.stones.length + this.caps.length
  }

  clone() {
    const stash = new Stash()
    stash.stones = this.stones.map(s => s.clone())
    stash.caps = this.caps.map(c => c.clone())
    return stash
  }
}
