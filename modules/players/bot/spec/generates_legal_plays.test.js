import test from 'ava'
import Board from '../../../game/src/board.js'
import Bot from '../src/bot.js'
import Stack from '../../../game/src/stack.js'
import { Cap, Stone } from '../../../game/src/piece.js'
import Move from '../../../game/src/move.js'

test('empty board', t => {
  const board = new Board(5)

  const plays = new Bot().legals(board)

  t.is(plays.length, 25 * 3)
  t.like(plays.map(p => p.ptn()), [
    'a1', 'Sa1', 'Ca1',
    'a2', 'Sa2', 'Ca2'
  ])
})

test('no stones', t => {
  const board = new Board(5)
  board.white.stones = []

  const plays = new Bot().legals(board)

  t.is(plays.length, 25)
  t.like(plays.map(p => p.ptn()), [
    'Ca1', 'Ca2', 'Ca3'
  ])
})

test('no caps', t => {
  const board = new Board(5)
  board.white.caps = []

  const plays = new Bot().legals(board)

  t.is(plays.length, 25 * 2)
  t.like(plays.map(p => p.ptn()), [
    'a1', 'Sa1',
    'a2', 'Sa2',
  ])
})

test('occupied square', t => {
  const board = new Board(5)
  board.squares['a1'].stack(Stack.of(
    new Stone('black')))

  const plays = new Bot().legals(board)

  t.is(plays.length, 25 * 3 - 3)
  t.like(plays.map(p => p.ptn()), [
    'a2', 'Sa2', 'Ca2',
    'a3', 'Sa3', 'Ca3',
  ])
})

test('single piece', t => {
  const board = new Board(3)
  board.squares['b2'].stack(Stack.of(
    new Stone('white')))

  const plays = new Bot().legals(board)

  t.deepEqual(plays.map(p => p.ptn())
    .filter(p => p.includes('b2')), [
    'b2+', 'b2-', 'b2>', 'b2<'
  ])
})

test('in corner', t => {
  const board = new Board(3)
  board.squares['a1'].stack(Stack.of(
    new Stone('white')))

  const plays = new Bot().legals(board)

  t.deepEqual(plays.map(p => p.ptn())
    .filter(p => p.includes('a1')), [
    'a1+', 'a1>'
  ])
})

test('lonely stack', t => {
  const board = new Board(7)
  board.squares['d4'].stack(Stack.of(
    new Stone('white'),
    new Stone('white'),
    new Stone('white')))

  const plays = new Bot().legals(board)

  for (const d of ['+', '-', '<', '>'])
    t.deepEqual(plays
      .map(p => p.ptn())
      .filter(p => p.includes(`d4${d}`)),
      [
        `d4${d}`,
        `2d4${d}`,
        `2d4${d}11`,
        `3d4${d}`,
        `3d4${d}21`,
        `3d4${d}12`,
        `3d4${d}111`,
      ])
})

test('small board', t => {
  const board = new Board(5)
  board.squares['c3'].stack(Stack.of(
    new Stone('white'),
    new Stone('white'),
    new Stone('white')))

  const plays = new Bot().legals(board)

  t.deepEqual(plays
    .map(p => p.ptn())
    .filter(p => p.includes(`c3>`)),
    [
      'c3>',
      '2c3>',
      '2c3>11',
      '3c3>',
      '3c3>21',
      '3c3>12',
    ])
})

test('walled in', t => {
  const board = new Board(5)
  board.squares['c3'].stack(Stack.of(
    new Stone('white'),
    new Stone('white')))
  board.squares['d3'].stack(Stack.of(
    new Stone('black').stand()))
  board.squares['c5'].stack(Stack.of(
    new Stone('black').stand()))
  board.squares['c2'].stack(Stack.of(
    new Stone('black').stand()))
  board.squares['b3'].stack(Stack.of(
    new Cap('black')))

  const plays = new Bot().legals(board)

  t.deepEqual(plays.map(p => p.ptn())
    .filter(p => p.includes('c3')),
    [
      'c3+',
      '2c3+',
    ])
})

test('carry limit', t => {
  const board = new Board(3)
  board.squares['a1'].stack(Stack.of(
    new Stone('white'),
    new Stone('white'),
    new Stone('white'),
    new Stone('white')))

  const plays = new Bot().legals(board)

  t.deepEqual(plays.map(p => p.ptn())
    .filter(p => p.includes('a1>')),
    [
      `a1>`,
      `2a1>`,
      `2a1>11`,
      `3a1>`,
      `3a1>21`,
      `3a1>12`
    ])
})

test('wall smash', t => {
  const board = new Board(3)
  board.squares['a1'].stack(Stack.of(
    new Stone('white'),
    new Stone('white'),
    new Cap('white')))
  board.squares['c1'].stack(Stack.of(
    new Stone('black').stand()))
  board.squares['a2'].stack(Stack.of(
    new Stone('black').stand()))

  const plays = new Bot().legals(board)

  t.deepEqual(plays.map(p => p.ptn())
    .filter(p => p.includes('a1')),
    [
      'a1+',
      `a1>`,
      `2a1>`,
      `2a1>11`,
      `3a1>`,
      `3a1>21`,
    ])
})

test('full board', t => {
  const board = new Board(3)

  board.squares_list.forEach(s =>
    s.stack(Stack.of(
      new Stone((s.coords.rank + s.coords.file) % 2
        ? 'white' : 'black'))))

  const plays = new Bot().legals(board)

  t.is(plays.length, 0)
})

test('white road', t => {
  const board = new Board(3)
  board.squares_list.slice(3).forEach(s =>
    s.stack(Stack.of(new Stone('white'))))

  const plays = new Bot().legals(board)

  t.is(plays.length, 0)
})

test('black road', t => {
  const board = new Board(3)
  board.squares_list.slice(3).forEach(s =>
    s.stack(Stack.of(new Stone('black'))))

  const plays = new Bot().legals(board)

  t.is(plays.length, 0)
})