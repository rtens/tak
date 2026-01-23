import Bot from './bot.js'

export default class Simple extends Bot {

  constructor(runner, depth) {
    super(runner)
    this.depth = depth ? parseInt(depth) : 2
  }

  name() {
    return 'SimpleBot@' + this.depth
  }

  best_play(board, color) {
    const evals = this.legal_plays(board, color)
      .map(play => ({
        play,
        evaluation: this.evaluate_play(board.clone(), play, color, this.depth)
      }))

    // console.log(color, evals.map(e => e.play.ptn() + ' ' + e.evaluation))

    const best = color == 'white'
      ? Math.max(...evals.map(e => e.evaluation))
      : Math.min(...evals.map(e => e.evaluation))

    const best_plays = evals
      .filter(e => e.evaluation == best)
      .map(e => e.play)

    return best_plays[Math.floor(this.random() * best_plays.length)]
  }

  evaluate_play(board, play, color, depth = 0) {
    play.apply(board, color)
    const evaluation = this.evaluate(board)

    if (!depth) return evaluation

    if (Math.abs(evaluation) > 900)
      return evaluation + (color == 'white' ? depth : -depth)

    const next = color == 'white' ? 'black' : 'white'

    const evals = this.legal_plays(board, next)
      .map(play => this.evaluate_play(board.clone(), play, next, depth - 1))

    return next == 'white'
      ? Math.max(...evals)
      : Math.min(...evals)
  }

  evaluate(board) {
    if (board.road('white')) return 9000
    if (board.road('black')) return -9000

    let evaluation = board.black.count() - board.white.count()

    const { white, black } = board.flat_count()
    evaluation += (white - black) * 10

    if (board.full() || !board.white.count() || !board.black.count())
      return (white - black) * 1000

    return evaluation
  }
}
