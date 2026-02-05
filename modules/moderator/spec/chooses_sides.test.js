import test from 'ava'
import MockUser from './lib/mock_user.js'
import Moderator from '../src/moderator.js'
import MockPlayer from './lib/mock_player.js'

test('player 1 is white', async t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  user.answer('Player 1', 'foo one')
  user.answer('Player 2', 'foo two')
  user.answer('Who is white', '1')

  const player = class extends MockPlayer { }
  mod.import = player.importer()

  await mod.start()

  t.is(player.playing.white, 'one')
  t.is(player.playing.black, 'two')
})

test('player 2 is white', async t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  user.answer('Player 1', 'foo one')
  user.answer('Player 2', 'foo two')
  user.answer('Who is white', '2')

  const player = class extends MockPlayer { }
  mod.import = player.importer()

  await mod.start()

  t.is(player.playing.white, 'two')
  t.is(player.playing.black, 'one')
})

test('random sides low', async t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  user.answer('Player 1', 'foo one')
  user.answer('Player 2', 'foo two')
  user.answer('Who is white', '')

  const player = class extends MockPlayer { }
  mod.import = player.importer()

  mod.random = () => 0
  await mod.start()

  t.is(player.playing.white, 'one')
})

test('random sides high', async t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  user.answer('Player 1', 'foo one')
  user.answer('Player 2', 'foo two')
  user.answer('Who is white', '')

  const player = class extends MockPlayer { }
  mod.import = player.importer()

  mod.random = () => 1
  await mod.start()

  t.is(player.playing.white, 'two')
})