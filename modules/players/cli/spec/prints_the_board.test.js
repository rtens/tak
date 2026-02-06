import test from 'ava'
import Cli from '../src/cli.js'
import Game from '../../../game/src/game.js'
import Place from '../../../game/src/place.js'
import { Cap, Stone } from '../../../game/src/piece.js'
import Stack from '../../../game/src/stack.js'

test('play after', async t => {
  const answers = ['', 'a1']
  const told = []
  const cli = new Cli({
    user: {
      ask: async () => answers.shift(),
      tell: msg => told.push(msg)
    }
  })

  const game = new Game(3)
  const played = await cli.play(game)

  t.deepEqual(played, Place.Flat.at(0, 0))
})

test('empty board', async t => {
  const game = new Game(3)

  t.deepEqual(await print(game), [
    `  ,-----------,`,
    `3 |   |   |   | > C: 0`,
    `  |---+---+---| > S: 10`,
    `2 |   |   |   |`,
    `  |---+---+---|   c: 0`,
    `1 |   |   |   |   s: 10`,
    `  '-----------'`,
    `    a   b   c `
  ])
})

test('blacks turn', async t => {
  const game = new Game(3)
  game.board.turn = 'black'

  t.deepEqual(await print(game), [
    `  ,-----------,`,
    `3 |   |   |   |   C: 0`,
    `  |---+---+---|   S: 10`,
    `2 |   |   |   |`,
    `  |---+---+---| > c: 0`,
    `1 |   |   |   | > s: 10`,
    `  '-----------'`,
    `    a   b   c `
  ])
})

test('larger board', async t => {
  const game = new Game(5)

  t.deepEqual(await print(game), [
    '  ,-------------------,',
    '5 |   |   |   |   |   | > C: 1',
    '  |---+---+---+---+---| > S: 21',
    '4 |   |   |   |   |   |',
    '  |---+---+---+---+---|   c: 1',
    '3 |   |   |   |   |   |   s: 21',
    '  |---+---+---+---+---|',
    '2 |   |   |   |   |   |',
    '  |---+---+---+---+---|',
    '1 |   |   |   |   |   |',
    `  '-------------------'`,
    '    a   b   c   d   e ',
  ])
})

test('single pieces', async t => {
  const game = new Game(5)
  game.perform(Place.Flat.at(0, 4))
  game.perform(Place.Flat.at(0, 3))
  game.perform(Place.Wall.at(1, 4))
  game.perform(Place.Wall.at(1, 3))
  game.perform(Place.Cap.at(2, 4))
  game.perform(Place.Cap.at(2, 3))

  t.deepEqual(await print(game), [
    '  ,-------------------,',
    '5 | f | S | C |   |   | > C: 0',
    '  |---+---+---+---+---| > S: 19',
    '4 | F | s | c |   |   |',
    '  |---+---+---+---+---|   c: 0',
    '3 |   |   |   |   |   |   s: 19',
    '  |---+---+---+---+---|',
    '2 |   |   |   |   |   |',
    '  |---+---+---+---+---|',
    '1 |   |   |   |   |   |',
    `  '-------------------'`,
    '    a   b   c   d   e ',
  ])
})

test('stacks', async t => {
  const game = new Game(3)
  game.board.squares['a1'].stack(Stack.of(
    new Stone('white'),
    new Stone('black'),
    new Stone('black'),
    new Stone('white').stand(),
  ))
  game.board.squares['c1'].stack(Stack.of(
    new Stone('black'),
    new Cap('white')
  ))
  game.board.squares['b2'].stack(Stack.of(
    new Stone('black'),
    new Stone('white')
  ))

  t.deepEqual(await print(game), [
    '  ,-----------,',
    '3 |   |   |   | > C: 0',
    '  |---+---+---| > S: 10',
    '2 |   | F |   |',
    '2 |   | f |   |   c: 0',
    '  |---+---+---|   s: 10',
    '1 | S |   |   |',
    '1 | f |   |   |',
    '1 | f |   | C |',
    '1 | F |   | f |',
    `  '-----------'`,
    '    a   b   c ',
  ])
})

test('game over', async t => {
  const told = []
  const cli = new Cli({
    user: {
      ask: async () => null,
      tell: msg => told.push(msg)
    }
  })

  cli.over(new Game(3))
  t.deepEqual(told[0].split('\n'), [
    `  ,-----------,`,
    `3 |   |   |   | > C: 0`,
    `  |---+---+---| > S: 10`,
    `2 |   |   |   |`,
    `  |---+---+---|   c: 0`,
    `1 |   |   |   |   s: 10`,
    `  '-----------'`,
    `    a   b   c `
  ])
})

async function print(game) {
  const answers = ['']
  const told = []
  const cli = new Cli({
    user: {
      ask: async () => answers.shift(),
      tell: msg => told.push(msg)
    }
  })

  await cli.play(game)
  return told[0].split('\n')
}
