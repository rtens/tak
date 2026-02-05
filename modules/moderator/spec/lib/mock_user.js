import User from '../../src/user.js'

export default class MockUser {

  constructor() {
    this.answers = []
    this.told = []
  }

  answer(prompt, answer) {
    this.answers.push({ prompt, answer })
  }

  async ask(prompt) {
    const answer = this.answers.find(a => prompt.startsWith(a.prompt))
    if (answer) return answer.answer
    return ''
  }

  tell(message) {
    this.told.push(message)
  }

  paint(_color, message) {
    return message
  }
}