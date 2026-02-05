import test from 'ava'
import MockUser from './lib/mock_user.js'
import MockPlayer from './lib/mock_player.js'
import Moderator from '../src/moderator.js'

test('default size', async t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  const player = class extends MockPlayer { }
  mod.import = player.importer()

  await mod.start()

  t.is(player.playing.board.size, 5)
})

test('size 3', async t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  user.answer('Board size', '3')

  const player = class extends MockPlayer { }
  mod.import = player.importer()

  await mod.start()

  t.is(player.playing.board.size, 3)
})