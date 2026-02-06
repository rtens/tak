import test from 'ava'
import Cli from '../src/cli.js'

test('default name', t => {
  const cli = new Cli()

  t.is(cli.name(), 'nemo')
})

test('given name', t => {
  const cli = new Cli(null, 'Foo')

  t.is(cli.name(), 'Foo')
})