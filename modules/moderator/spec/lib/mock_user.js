export default class MockUser {

  constructor() {
    this.answers = []
    this.told = []
    this.saved = []
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

  save(file, content) {
    this.saved.push({ file, content })
  }

  bye() {
    this.closed = true
  }
}