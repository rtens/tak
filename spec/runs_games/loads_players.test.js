import test from 'ava'
import MockInterface from '../mock_interface.js'
import Runner from '../../src/runner.js'

test('existing file', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  const imported = []
  runner.import = file => {
    imported.push(file)
    return { default: class { } }
  }

  inter.answer("Player 1:", "foo")
  inter.answer("Player 2:", "bar")
  runner.run()

  t.like(imported, [
    './players/foo.js',
    './players/bar.js'
  ])
})

test('with arguments', async t => {
  const inter = new MockInterface(t)
  const runner = new Runner(inter)

  const constructed = []
  runner.import = () => ({
    default: class {
      constructor(runner, ...args) {
        t.assert(runner instanceof Runner)
        constructed.push(args)
      }
    }
  })

  inter.answer("Player 1:", "foo one two")
  inter.answer("Player 2:", "bar tre")
  runner.run()

  t.like(constructed, [
    ['one', 'two'],
    ['tre']
  ])
})
