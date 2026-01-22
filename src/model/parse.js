import Coords from './coords.js'
import Move from './move.js'
import Place from './place.js'

export default function parse(ptn) {
  if (ptn.length == 2) {
    return new Place.Flat(parse_coords(ptn))

  } else if (ptn.startsWith('S')) {
    return new Place.Wall(parse_coords(ptn.slice(1)))

  } else if (ptn.startsWith('C')) {
    return new Place.Cap(parse_coords(ptn.slice(1)))

  } else if (ptn.length == 3) {
    return new Move(parse_coords(ptn))
      .to(ptn.slice(2))
      .drop(1)

  } else if (ptn.length == 4) {
    return new Move(parse_coords(ptn.slice(1)))
      .to(ptn.slice(3))
      .drop(parseInt(ptn.slice(0, 1)))

  } else {
    const move = new Move(parse_coords(ptn.slice(1)))
      .to(ptn.slice(3, 4))
    move.drops = ptn.slice(4).split('').map(n => parseInt(n))
    return move
  }
}

function parse_coords(coords) {
  return new Coords(
    coords.charCodeAt(0) - 97,
    parseInt(coords[1]) - 1)
}