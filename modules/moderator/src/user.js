import fs from 'fs'
import path from 'path'
import process from 'process'
import readline from 'readline'

export default class User {

  constructor(args) {
    this.args = args
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
  }

  tell(message) {
    console.log(message)
  }

  paint(color, message) {
    return `\x1b[${colors[color]}m${message}\x1b[0m`
  }

  async ask(prompt) {
    process.stdout.write(this.paint('white', prompt) + ' ')
    if (this.args.length) {
      this.tell(this.args[0])
      return this.args.shift()
    }
    return (await this.rl[Symbol.asyncIterator]().next()).value
  }

  save(file, content) {
    const dir = path.dirname(file)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

    fs.writeFileSync(file, content)
  }

  bye() {
    this.rl.close()
  }
}

const colors = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
}