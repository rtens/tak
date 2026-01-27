import test from 'ava'
import MockInterface from '../mock_interface.js'
import MockPlayer from './mock_player.js'
import Runner from '../../src/runner.js'
import Game from '../../src/model/game.js'
import Stack from '../../src/model/stack.js'
import { Stone } from '../../src/model/piece.js'
import Place from '../../src/model/place.js'
import Move from '../../src/model/move.js'
import parse from '../../src/model/parse.js'

test('try again', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  runner.import = MockPlayer.playing([
    'a1', 'a1'
  ]).import()

  inter.answer("Player 1:", "foo One")
  inter.answer("Player 2:", "foo Two")
  inter.answer("Who is white? (1, 2, [r]andom)", "1")
  inter.answer("Board size: (3-8 [5])", "3")

  await runner.run()

  t.like(inter.outputs.slice(5), [
    'Two plays a1',
    'Illegal play: Square not empty',
    'Two\'s turn (black)'
  ])
})

test('not a square', t => {
  const game = new Game(3)
  const error = t.throws(() =>
    game.perform(parse('d5')))

  t.is(error.message, 'Not a square: d5')
})

test('out of flats', t => {
  const game = new Game(3)
  game.perform(parse('a1'))
  game.perform(parse('b1'))

  game.board.white.stones = []

  const error = t.throws(() =>
    game.perform(Place.Flat.at(2, 0)))

  t.is(error.message, 'No stones left')
})

test('out of walls', t => {
  const game = new Game(3)
  game.perform(Place.Flat.at(0, 0))
  game.perform(Place.Flat.at(1, 0))

  game.board.white.stones = []

  const error = t.throws(() =>
    game.perform(Place.Wall.at(2, 0)))

  t.is(error.message, 'No stones left')
})

test('out of caps', t => {
  const game = new Game(3)
  game.perform(Place.Flat.at(0, 0))
  game.perform(Place.Flat.at(1, 0))

  game.board.white.caps = []

  const error = t.throws(() =>
    game.perform(Place.Cap.at(2, 0)))

  t.is(error.message, 'No caps left')
})

test('first play not place flat', t => {
  const game = new Game(3)
  const error = t.throws(() =>
    game.perform(Place.Wall.at(0, 0)))

  t.is(error.message, 'First two plays must place flats')
})

test('second play not place flat', t => {
  const game = new Game(3)

  game.perform(Place.Flat.at(1, 1))
  const error = t.throws(() =>
    game.perform(Place.Wall.at(0, 0)))

  t.is(error.message, 'First two plays must place flats')
})

test('place on flat', t => {
  const game = new Game(3)

  game.perform(Place.Flat.at(0, 0))
  const error = t.throws(() =>
    game.perform(Place.Flat.at(0, 0)))

  t.is(error.message, 'Square not empty')
})

test('not your stack', t => {
  const game = new Game(3)

  game.perform(Place.Flat.at(0, 0))
  game.perform(Place.Flat.at(1, 1))

  const error = t.throws(() =>
    game.perform(Move.at(0, 0).right().drop(1)))

  t.is(error.message, "Not white's stack")
})

test('drop on wall', t => {
  const game = new Game(3)

  game.perform(Place.Flat.at(1, 0))
  game.perform(Place.Flat.at(0, 0))

  game.perform(Place.Wall.at(2, 0))

  const error = t.throws(() =>
    game.perform(Move.at(1, 0).right().drop(1)))

  t.is(error.message, "Can't stack on wall")
})

test('drop on cap', t => {
  const game = new Game(5)

  game.perform(Place.Flat.at(1, 0))
  game.perform(Place.Flat.at(0, 0))

  game.perform(Place.Cap.at(2, 0))

  const error = t.throws(() =>
    game.perform(Move.at(1, 0).right().drop(1)))

  t.is(error.message, "Can't stack on cap")
})

test('over carry limit', t => {
  const game = new Game(3)

  game.perform(Place.Flat.at(1, 0))
  game.perform(Place.Flat.at(0, 0))

  game.board.squares['a1'].stack(new Stack([
    new Stone('white'),
    new Stone('white'),
    new Stone('white')
  ]))

  const error = t.throws(() =>
    game.perform(Move.at(0, 0).right().drop(2).drop(2)))

  t.is(error.message, 'Carry limit is 3')
})

test('no direction', t => {
  const game = new Game(3)

  game.perform(Place.Flat.at(1, 0))
  game.perform(Place.Flat.at(0, 0))

  const error = t.throws(() =>
    game.perform(Move.at(0, 0)))

  t.is(error.message, 'Direction missing')
})

test('no drops', t => {
  const game = new Game(3)

  game.perform(Place.Flat.at(1, 0))
  game.perform(Place.Flat.at(0, 0))

  const error = t.throws(() =>
    game.perform(Move.at(0, 0).right()))

  t.is(error.message, 'No drops')
})

test('empty drop', t => {
  const game = new Game(3)

  game.perform(Place.Flat.at(1, 0))
  game.perform(Place.Flat.at(0, 0))

  const error = t.throws(() =>
    game.perform(Move.at(0, 0).right().drop(0)))

  t.is(error.message, 'Empty drop')
})

test('drops more than taken', t => {
  const game = new Game(3)

  game.perform(Place.Flat.at(1, 0))
  game.perform(Place.Flat.at(0, 0))

  const error = t.throws(() =>
    game.perform(Move.at(0, 0).right().drop(2)))

  t.is(error.message, 'Can only take 1')
})

test('nothing to move', t => {
  const game = new Game(3)

  game.perform(Place.Flat.at(1, 0))
  game.perform(Place.Flat.at(0, 0))

  const error = t.throws(() =>
    game.perform(Move.at(1, 1).right().drop(1)))

  t.is(error.message, 'Empty square')
})
