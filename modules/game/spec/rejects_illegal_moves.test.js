import test from 'ava'
import Game from '../src/game.js'
import Place from '../src/place.js'
import Move from '../src/move.js'

test('not a square', t => {
  const game = new Game(3)
  game.perform(Place.Flat.at(0, 0))
  game.perform(Place.Flat.at(2, 2))

  const error = t.throws(() =>
    game.perform(Move.at(4, 3)))

  t.is(error.message, 'Not a square: e4')
})

test('no direction', t => {
  const game = new Game(3)
  game.perform(Place.Flat.at(2, 2))
  game.perform(Place.Flat.at(0, 0))

  const error = t.throws(() =>
    game.perform(Move.at(0, 0)))

  t.is(error.message, 'No direction')
})

test('no drops', t => {
  const game = new Game(3)
  game.perform(Place.Flat.at(2, 2))
  game.perform(Place.Flat.at(0, 0))

  const error = t.throws(() =>
    game.perform(Move.at(0, 0).up()))

  t.is(error.message, 'No drops')
})

test('nothing to move', t => {
  const game = new Game(3)
  game.perform(Place.Flat.at(0, 0))
  game.perform(Place.Flat.at(2, 2))

  const error = t.throws(() =>
    game.perform(Move.at(1, 1).up().drop(1)))

  t.is(error.message, 'Empty square')
})

test('not your stack', t => {
  const game = new Game(3)
  game.perform(Place.Flat.at(0, 0))
  game.perform(Place.Flat.at(2, 2))

  const error = t.throws(() =>
    game.perform(Move.at(0, 0).up().drop(1)))

  t.is(error.message, 'Not your stack')
})

test('over carry limit', t => {
  const game = new Game(3)
  game.perform(Place.Flat.at(2, 2))
  game.perform(Place.Flat.at(0, 0))

  const error = t.throws(() =>
    game.perform(Move.at(0, 0).up().drop(4)))

  t.is(error.message, 'Over carry limit')
})

test('empty drop', t => {
  const game = new Game(3)
  game.perform(Place.Flat.at(2, 2))
  game.perform(Place.Flat.at(0, 0))

  const error = t.throws(() =>
    game.perform(Move.at(0, 0).up().drop(0)))

  t.is(error.message, 'Empty drop')
})

test('over stack size', t => {
  const game = new Game(3)
  game.perform(Place.Flat.at(2, 2))
  game.perform(Place.Flat.at(0, 0))

  const error = t.throws(() =>
    game.perform(Move.at(0, 0).up().drop(2)))

  t.is(error.message, 'Over stack size')
})

test('drop on wall', t => {
  const game = new Game(3)
  game.perform(Place.Flat.at(0, 0))
  game.perform(Place.Flat.at(2, 2))
  game.perform(Place.Wall.at(0, 1))

  const error = t.throws(() =>
    game.perform(Move.at(0, 0).up().drop(1)))

  t.is(error.message, 'Drop on wall')
})

test('drop on cap', t => {
  const game = new Game(5)
  game.perform(Place.Flat.at(0, 0))
  game.perform(Place.Flat.at(2, 2))
  game.perform(Place.Cap.at(0, 1))

  const error = t.throws(() =>
    game.perform(Move.at(0, 0).up().drop(1)))

  t.is(error.message, 'Drop on cap')
})