import Coords from '../../../game/src/coords.js'
import { Cap } from '../../../game/src/piece.js'

export default function print_board(board, paint = null) {
  paint ||= { white: s => s, black: s => s }
  const stacks = sort_stacks(board)

  const rows = []
  for (let r = board.size - 1; r >= 0; r--) {
    const max = Math.max(1, ...stacks[r].map(s => s.length))

    for (let l = max - 1; l >= 0; l--) {
      const row = []
      for (const stack of stacks[r]) {
        const piece = stack[l]
        const p = piece
          ? paint[piece.color](symbol(piece))
          : ' '

        row.push(' ' + p + ' ')
      }
      rows.push((r + 1) + ' |' + row.join('|') + '|')
    }
    rows.push('  |' + repeat('---').join('+') + '|')
  }

  const files = [...Array(board.size).keys()]
    .map(i => ' ' + String.fromCharCode(97 + i) + ' ').join(' ')

  const output = [
    '  ,' + repeat('---').join('-') + ',',
    ...rows.slice(0, -1),
    "  '" + repeat('---').join('-') + "'",
    '   ' + files
  ].join('\n').split('\n')

  const turn = c => board.turn == c ? ' > ' : '   '
  output[1] += paint.white(turn('white') + 'C: ' + board.white.caps.length)
  output[2] += paint.white(turn('white') + 'S: ' + board.white.stones.length)
  output[4] += paint.black(turn('black') + 'c: ' + board.black.caps.length)
  output[5] += paint.black(turn('black') + 's: ' + board.black.stones.length)

  return output.join('\n')

  function repeat(v) {
    return [...Array(board.size)].map(() => v)
  }
}

function sort_stacks(board) {
  const stacks = []
  for (let r = 0; r < board.size; r++) {
    stacks.push([])
    for (let f = 0; f < board.size; f++) {
      stacks[r].push(board.square(new Coords(f, r)).pieces)
    }
  }
  return stacks
}

function symbol(piece) {
  const symbol = piece instanceof Cap ? 'c'
    : (piece.standing ? 's' : 'f')

  return piece.color == 'white'
    ? symbol.toUpperCase()
    : symbol
}