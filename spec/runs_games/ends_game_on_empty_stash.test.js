import test from 'ava'
import MockInterface from '../mock_interface.js'
import Runner from '../../src/runner.js'
import MockPlayer from './mock_player.js'

test('white runs out', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  runner.import = MockPlayer.playing([
    'a1', 'a2',
    ...[...Array(9)].reduce(a => [...a,
      'b2', 'b1',
      'b2<', 'b1<'], [])
  ]).import()

  inter.answer("Player 1:", "foo One")
  inter.answer("Player 2:", "foo Two")
  inter.answer("Who is white? (1, 2, [r]andom)", "1")
  inter.answer("Board size: (3-8 [5])", "3")

  await runner.run()

  t.true(inter.closed)
  t.like(inter.outputs.slice(-2), [
    "One won by flat count",
    "F-0",
  ])
})

test('black runs out', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  runner.import = MockPlayer.playing([
    'a1', 'a2',
    ...[...Array(7)].reduce(a => [...a,
      'b2', 'b1',
      'b2<', 'b1<'], []),
    'b2', 'b1',
    'b2<', 'b2'
  ]).import()

  inter.answer("Player 1:", "foo One")
  inter.answer("Player 2:", "foo Two")
  inter.answer("Who is white? (1, 2, [r]andom)", "1")
  inter.answer("Board size: (3-8 [5])", "3")

  await runner.run()

  t.true(inter.closed)
  t.like(inter.outputs.slice(-2), [
    "Two won by flat count",
    "0-F",
  ])
})