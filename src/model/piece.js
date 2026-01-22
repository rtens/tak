class Piece {

  constructor(color) {
    this.color = color
  }
}

export class Stone extends Piece {

  constructor(color) {
    super(color)
    this.standing = false
  }

  stand() {
    this.standing = true
    return this
  }

  flat() {
    this.standing = false
    return this
  }

  clone() {
    const stone = new Stone()
    stone.color = this.color
    stone.standing = this.standing
    return stone
  }
}

export class Capstone extends Piece {

  clone() {
    return this
  }
}