import { Cap, Stone } from './piece.js'
import Stack from './stack.js'

export default class Stash {

  constructor(color, stones, caps = 0) {
    this.color = color
    this.stones = [...Array(stones)].map(() => new Stone(color))
    this.caps = [...Array(caps)].map(() => new Cap(color))
  }

  take_flat() {
    if (!this.stones.length) {
      throw new Error('No stones left')
    }
    return Stack.of(this.stones.pop())
  }

  take_wall() {
    if (!this.stones.length) {
      throw new Error('No stones left')
    }
    return Stack.of(this.stones.pop().stand())
  }

  take_capstone() {
    if (!this.caps.length) {
      throw new Error('No capstones left')
    }
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
    return new Stash(
      this.color,
      this.stones.length,
      this.caps.length)
  }
}
