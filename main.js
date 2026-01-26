import process from 'process'
import Runner from './src/runner.js'
import Interface from './src/interface.js'

const args = process.argv.slice(2).join(' ').split('!').map(a => a.trim()).filter(a => !!a)

new Runner(new Interface(args)).run()