import test from 'ava'
import MockUser from './lib/mock_user.js'
import Moderator from '../src/moderator.js'
import MockPlayer from './lib/mock_player.js'

test('load file', async t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  const imported = []
  mod.import = file => {
    imported.push(file)
    return { default: MockPlayer }
  }

  user.answer('Player 1', 'one')
  user.answer('Player 2', 'two')

  await mod.start()

  t.deepEqual(imported, [
    '../../players/one/src/one.js',
    '../../players/two/src/two.js',
  ])
})

test('default player', async t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  const imported = []
  mod.import = file => {
    imported.push(file)
    return { default: MockPlayer }
  }

  user.answer('Player 1', '')
  user.answer('Player 2', '')

  await mod.start()

  t.deepEqual(imported, [
    '../../players/bot/src/bot.js',
    '../../players/bot/src/bot.js',
  ])
})

test('pass arguments', async t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  const constructed = []
  mod.import = () => ({
    default: class extends MockPlayer {
      constructor(...args) {
        super()
        constructed.push(args)
      }
    }
  })

  user.answer('Player 1', 'one 2 tre')
  user.answer('Player 2', 'two')

  await mod.start()

  t.deepEqual(constructed, [
    [mod, '2', 'tre'],
    [mod]
  ])
})