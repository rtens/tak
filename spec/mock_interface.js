export default class MockInterface {

  constructor() {
    this.outputs = []
    this.answers = {}
  }

  print(line) {
    this.outputs.push(line)
  }

  read(prompt) {
    if (!(prompt in this.answers))
      throw new Error('Unexpected prompt: ' + prompt)
    return this.answers[prompt]
  }

  answer(prompt, response) {
    this.answers[prompt] = response
  }
}
