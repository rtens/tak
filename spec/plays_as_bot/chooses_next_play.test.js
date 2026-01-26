import test from 'ava'
import Game from '../../src/model/game.js'
import parse from '../../src/model/parse.js'
import Bot from '../../src/players/bot.js'
import Stack from '../../src/model/stack.js'
import { Stone } from '../../src/model/piece.js'

test('first play', t => {
  const game = new Game()

  const play = new Bot().play(game)

  t.is(play.ptn(), 'a1')
})

test('second play', t => {
  const game = played('a1')

  const play = new Bot().play(game)

  t.is(play.ptn(), 'c3')
})

test('white prefers flats', t => {
  const game = played('a1', 'a2')

  const plays = new Bot().best_plays(game.board, 0)

  t.deepEqual(plays.map(p => p.ptn()), [
    'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3'
  ])
})

test('black prefers flats', t => {
  const game = played('a1', 'a2', 'a3')

  const plays = new Bot().best_plays(game.board, 0)

  t.deepEqual(plays.map(p => p.ptn()), [
    'b1', 'b2', 'b3', 'c1', 'c2', 'c3'
  ])
})

test('white finishes road', t => {
  const game = played('a1', 'a2', 'b2', 'a3')

  const plays = new Bot().best_plays(game.board, 0)

  t.deepEqual(plays.map(p => p.ptn()), [
    'c2'
  ])
})

test('black finishes road', t => {
  const game = played('a1', 'a2', 'a3', 'b1', 'c3')

  const plays = new Bot().best_plays(game.board, 0)

  t.deepEqual(plays.map(p => p.ptn()), [
    'c1'
  ])
})

test('level 0 does not see tak', t => {
  const game = played('a1', 'a2', 'b2')

  const plays = new Bot().best_plays(game.board, 0)

  t.deepEqual(plays.map(p => p.ptn()), [
    'a3', 'b1', 'b3', 'c1', 'c2', 'c3'
  ])
})

test('prevent white road', t => {
  const game = played('a2', 'a1', 'b1')

  const plays = new Bot().best_plays(game.board, 1)

  t.deepEqual(plays.map(p => p.ptn()), [
    'c1'
  ])
})

test('prevent other white road', t => {
  const game = played('a1', 'c3', 'a2', 'a3', 'a2+')

  const plays = new Bot().best_plays(game.board, 1)

  t.deepEqual(plays.map(p => p.ptn()), [
    'b3'
  ])
})

test('prevent black road', t => {
  const game = played('a2', 'c3')
  game.board.squares['a2'].stack(new Stack([
    new Stone('black'),
    new Stone('black'),
    new Stone('black')
  ]))

  const plays = new Bot().best_plays(game.board, 1)

  t.deepEqual(plays.map(p => p.ptn()), [
    'Sb2', 'Sc2'
  ])
})

test('white prefers the sooner road', t => {
  const game = played('a1', 'a3', 'b3')
  game.board.turn = 'white'

  const plays = new Bot().best_plays(game.board, 2)

  t.deepEqual(plays.map(p => p.ptn()), [
    'c3'
  ])
})

test('black prefers the sooner road', t => {
  const game = played('a1', 'a3')
  game.board.squares['b1'].stack(new Stack([new Stone('black')]))
  game.board.turn = 'black'

  const plays = new Bot().best_plays(game.board, 2)

  t.deepEqual(plays.map(p => p.ptn()), [
    'c1'
  ])
})

function played(...plays) {
  const game = new Game(3)
  plays.forEach(p => game.perform(parse(p)))
  return game
}

