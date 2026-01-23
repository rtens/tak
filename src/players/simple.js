import Bot from './bot.js'

export default class Simple extends Bot {

  name() {
    return 'Simple Bot'
  }

  best_play(board, color) {
    const plays = this.legal_plays(board, color)

    const evals = plays.map(play => {
      const clone = board.clone()
      play.apply(clone, color)
      let evaluation = this.evaluate(clone)
      if (color == 'black') evaluation *= -1

      return { play, evaluation }
    })

    const max = Math.max(...evals.map(e => e.evaluation))
    const bests = evals
      .filter(e => e.evaluation == max)
      .map(e => e.play)

    return bests[Math.floor(this.random() * bests.length)]
  }

  evaluate(board) {
    let evaluation = 0

    if (board.road('white')) return 9000
    if (board.road('black')) return -9000

    evaluation += board.white.missing() - board.black.missing()

    const { white, black } = board.flat_count()
    evaluation += (white - black) * 10

    return evaluation
  }
}
