import test from 'ava'
import Board from '../../src/model/board.js'
import Move from '../../src/model/move.js'
import Place from '../../src/model/place.js'
import { Cap, Stone } from '../../src/model/piece.js'
import Stack from '../../src/model/stack.js'
import parse from '../../src/model/parse.js'

test('place flat', t => {
  const board = new Board(3)

  const play = parse('a1')
  board.apply(play)
  board.revert(play)

  t.is(board.white.stones.length, 10)
  t.deepEqual(board.squares['a1'].pieces, [])
})

test('place wall', t => {
  const board = new Board(3)
  board.apply(parse('a1'))
  board.apply(parse('a2'))

  const play = parse('Sb2')
  board.apply(play)
  board.revert(play)

  t.is(board.white.stones.length, 9)
  t.like(board, {
    turn: 'white',
    squares: {
      b2: { pieces: [undefined] },
    }
  }, board.print())
})

test('place cap', t => {
  const board = new Board(5)
  board.apply(parse('a1'))
  board.apply(parse('a2'))

  const play = parse('Cb2')
  board.apply(play)
  board.revert(play)

  t.like(board, {
    turn: 'white',
    white: { caps: [new Cap('white')] },
    squares: {
      b2: { pieces: [undefined] },
    }
  }, board.print())
})

test('move one', t => {
  const board = new Board(3)
  board.apply(parse('a1'))
  board.apply(parse('a2'))

  const play = parse('a2>')
  board.apply(play)
  board.revert(play)

  t.like(board, {
    turn: 'white',
    squares: {
      a2: {
        pieces: [
          new Stone('white'),
        ]
      },
      b2: { pieces: [undefined] },
    }
  }, board.print())
})

test('spread stack', t => {
  const board = new Board(3)
  board.apply(parse('a1'))
  board.apply(parse('a2'))
  board.apply(parse('Sb2'))
  board.apply(parse('a1+'))
  board.apply(parse('b2<'))
  board.apply(parse('a1'))
  board.apply(parse('3a2-'))
  board.apply(parse('a2'))

  const play = parse('3a1>21')
  board.apply(play)
  board.revert(play)

  t.like(board, {
    turn: 'white',
    squares: {
      a1: {
        pieces: [
          new Stone('black'),
          new Stone('white'),
          new Stone('black'),
          new Stone('white').stand(),
        ]
      },
      b1: { pieces: [undefined] },
      c1: { pieces: [undefined] },
    }
  }, board.print())
})

test('smash wall', t => {
  const board = new Board(5)
  board.apply(parse('a1'))
  board.apply(parse('a2'))
  board.apply(parse('Cb1'))
  board.apply(parse('Sb2'))

  const play = parse('b1+')
  board.apply(play)
  board.revert(play)

  t.like(board, {
    turn: 'white',
    squares: {
      b1: {
        pieces: [
          new Cap('white'),
        ]
      },
      b2: {
        pieces: [
          new Stone('black').stand()
        ]
      },
    }
  }, board.print())
})

test('no smash', t => {
  const board = new Board(5)
  board.apply(parse('a1'))
  board.apply(parse('a2'))
  board.apply(parse('Cb1'))
  board.apply(parse('b2'))

  const play = parse('b1+')
  board.apply(play)
  board.revert(play)

  t.like(board, {
    turn: 'white',
    squares: {
      b1: {
        pieces: [
          new Cap('white'),
        ]
      },
      b2: {
        pieces: [
          new Stone('black')
        ]
      },
    }
  }, board.print())
})
