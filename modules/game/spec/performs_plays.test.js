import test from 'ava'
import Game from '../src/game.js'
import Place from '../src/place.js'
import Move from '../src/move.js'
import { Cap, Stone } from '../src/piece.js'
import Square from '../src/square.js'
import Stack from '../src/stack.js'

test('takes turns', t => {
  const game = new Game(3)

  game.perform(Place.Flat.at(0, 0))
  t.is(game.board.turn, 'black')

  game.perform(Place.Flat.at(0, 1))
  t.is(game.board.turn, 'white')
})

test('starting plays', t => {
  const game = new Game(3)

  game.perform(Place.Flat.at(0, 0))
  game.perform(Place.Flat.at(0, 1))

  t.is(game.board.white.stones.length, 9)
  t.is(game.board.black.stones.length, 9)
  t.like(game.board.squares, {
    a1: Square.at(0, 0).with(new Stone('black')),
    a2: Square.at(0, 1).with(new Stone('white')),
  })
})

test('place flat', t => {
  const game = start(3)

  game.perform(Place.Flat.at(1, 1))

  t.like(game.board.squares, {
    b2: Square.at(1, 1).with(new Stone('white')),
  })
})

test('place wall', t => {
  const game = start(3)

  game.perform(Place.Wall.at(1, 1))

  t.like(game.board.squares, {
    b2: Square.at(1, 1).with(new Stone('white').stand()),
  })
})

test('place cap', t => {
  const game = start(5)

  game.perform(Place.Cap.at(1, 1))

  t.like(game.board.squares, {
    b2: Square.at(1, 1).with(new Cap('white')),
  })
})

test('move right', t => {
  const game = start(3)
  game.board.squares['b2'].stack(Stack.of(
    new Stone('white')))

  game.perform(Move.at(1, 1).right().drop(1))

  t.like(game.board.squares, {
    b2: Square.at(1, 1).with(),
    c2: Square.at(2, 1).with(new Stone('white')),
  })
})

test('move up', t => {
  const game = start(3)
  game.board.squares['b2'].stack(Stack.of(
    new Stone('white')))

  game.perform(Move.at(1, 1).up().drop(1))

  t.like(game.board.squares, {
    b2: Square.at(1, 1).with(),
    b3: Square.at(1, 2).with(new Stone('white')),
  })
})

test('move left', t => {
  const game = start(3)
  game.board.squares['b2'].stack(Stack.of(
    new Stone('white')))

  game.perform(Move.at(1, 1).left().drop(1))

  t.like(game.board.squares, {
    b2: Square.at(1, 1).with(),
    a2: Square.at(0, 1).with(new Stone('white')),
  })
})

test('move down', t => {
  const game = start(3)
  game.board.squares['b2'].stack(Stack.of(
    new Stone('white')))

  game.perform(Move.at(1, 1).down().drop(1))

  t.like(game.board.squares, {
    b2: Square.at(1, 1).with(),
    b1: Square.at(1, 0).with(new Stone('white')),
  })
})

test('move on flat', t => {
  const game = start(3)
  game.board.squares['b2'].stack(Stack.of(
    new Stone('white')))
  game.board.squares['c2'].stack(Stack.of(
    new Stone('black')))

  game.perform(Move.at(1, 1).right().drop(1))

  t.like(game.board.squares, {
    b2: Square.at(1, 1).with(),
    c2: Square.at(2, 1).with(
      new Stone('black'),
      new Stone('white')),
  })
})

test('move stack', t => {
  const game = start(3)
  game.board.squares['b2'].stack(Stack.of(
    new Stone('white'),
    new Stone('black'),
    new Stone('white').stand()))

  game.perform(Move.at(1, 1).right().drop(2))

  t.like(game.board.squares, {
    b2: Square.at(1, 1).with(
      new Stone('white')
    ),
    c2: Square.at(2, 1).with(
      new Stone('black'),
      new Stone('white').stand()
    ),
  })
})

test('spread stack', t => {
  const game = start(4)
  game.board.squares['a2'].stack(Stack.of(
    new Stone('white'),
    new Stone('black'),
    new Stone('white'),
    new Stone('black'),
    new Stone('white').stand()))

  game.perform(Move.at(0, 1).right()
    .drop(1)
    .drop(2)
    .drop(1))

  t.like(game.board.squares, {
    a2: Square.at(0, 1).with(
      new Stone('white')
    ),
    b2: Square.at(1, 1).with(
      new Stone('black')
    ),
    c2: Square.at(2, 1).with(
      new Stone('white'),
      new Stone('black')
    ),
    d2: Square.at(3, 1).with(
      new Stone('white').stand()
    ),
  })
})

test('smash wall', t => {
  const game = start(3)
  game.board.squares['b2'].stack(Stack.of(
    new Cap('white')))
  game.board.squares['c2'].stack(Stack.of(
    new Stone('black'),
    new Stone('white').stand()))

  game.perform(Move.at(1, 1).right().drop(1))

  t.like(game.board.squares, {
    c2: Square.at(2, 1).with(
      new Stone('black'),
      new Stone('white'),
      new Cap('white')
    )
  })
})

function start(size) {
  const game = new Game(size)
  game.perform(Place.Flat.at(0, 0))
  game.perform(Place.Flat.at(0, 2))
  return game
}
