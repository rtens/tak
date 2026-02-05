import test from 'ava'
import MockUser from './lib/mock_user.js'
import Moderator from '../src/moderator.js'
import MockPlayer from './lib/mock_player.js'
import Place from '../../game/src/place.js'
import { Stone } from '../../game/src/piece.js'

test('legal plays', async t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  user.answer('Player 1', 'foo one')
  user.answer('Player 2', 'foo two')
  user.answer('Who is white', '1')

  const player = MockPlayer.playing(
    Place.Flat.at(0, 0),
    Place.Flat.at(0, 1),
    Place.Flat.at(2, 0),
    Place.Flat.at(2, 1)
  )
  mod.import = player.importer()

  await mod.start()

  t.like(user.told, [
    'one\'s turn as white',
    'one plays a1',
    'two\'s turn as black',
    'two plays a2'
  ])
  t.like(player.playing.board.squares, {
    a1: { pieces: [new Stone('black')] },
    a2: { pieces: [new Stone('white')] },
    c1: { pieces: [new Stone('white')] },
    c2: { pieces: [new Stone('black')] },
  })
})

test('illegal play', async t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  user.answer('Player 1', 'foo one')
  user.answer('Player 2', 'foo two')
  user.answer('Who is white', '1')

  const player = MockPlayer.playing(
    Place.Flat.at(5, 0),
    Place.Flat.at(0, 0),
  )
  mod.import = player.importer()

  await mod.start()

  t.like(user.told, [
    'one\'s turn as white',
    'one plays f1',
    'Illegal play: Not a square: f1',
    'one\'s turn as white',
    'one plays a1',
  ])
  t.like(player.playing.board.squares, {
    a1: { pieces: [new Stone('black')] },
  })
})