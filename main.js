import process from 'process'
import Moderator from './modules/moderator/src/moderator.js'
import User from './modules/moderator/src/user.js'

const args = process.argv.slice(2).join(' ').split(',')
  .map(a => a.trim()).filter(a => !!a)

new Moderator(new User(args)).start()