import test from 'ava'
import MockUser from './lib/mock_user.js'
import MockPlayer from './lib/mock_player.js'
import Moderator from '../src/moderator.js'

test('default size', t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  let playing
  mod.import = class extends MockPlayer {
    play(game) {
      playing = game
    }
  }.import

  mod.start()

  t.is(playing.board.size, 5)
})

test.skip('choose size', t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  user.answer('Board size', '3')

  let playing
  mod.import = class extends MockPlayer {
    play(game) {
      playing = game
    }
  }.import

  mod.start()

  t.is(playing.board.size, 3)
})

test.skip('player 1 is white', t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  user.answer('Player 1', 'any One')
  user.answer('Player 2', 'any Two')
  user.answer('Who is white', '1')

  let playing
  mod.import = class extends MockPlayer {
    play(game) {
      playing = game
    }
  }.import

  mod.start()

  t.is(playing.white, 'One')
  t.is(playing.black, 'Two')
})

test.skip('player 2 is white', t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  user.answer('Player 1', 'any One')
  user.answer('Player 2', 'any Two')
  user.answer('Who is white', '2')

  let playing
  mod.import = class extends MockPlayer {
    play(game) {
      playing = game
    }
  }.import

  mod.start()

  t.is(playing.white, 'Two')
  t.is(playing.black, 'One')
})

test.skip('random sides low', t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  user.answer('Player 1', 'any One')
  user.answer('Player 2', 'any Two')
  user.answer('Who is white', '')

  let playing
  mod.import = class extends MockPlayer {
    play(game) {
      playing = game
    }
  }.import

  mod.random = () => 0
  mod.start()

  t.is(playing.white, 'One')
})

test.skip('random sides high', t => {
  const user = new MockUser()
  const mod = new Moderator(user)

  user.answer('Player 1', 'any One')
  user.answer('Player 2', 'any Two')
  user.answer('Who is white', 'r')

  let playing
  mod.import = class extends MockPlayer {
    play(game) {
      playing = game
    }
  }.import

  mod.random = () => 1
  mod.start()

  t.is(playing.white, 'Two')
})
