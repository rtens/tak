import Player from '../../../moderator/src/player.js'
import Place from '../../../game/src/place.js'
import Move from '../../../game/src/move.js'
import { Cap } from '../../../game/src/piece.js'
import Coords from '../../../game/src/coords.js'

export default class Bot extends Player {

  constructor(mod) {
    super(mod)
    this.random = Math.random
  }

  name() {
    return 'Bot'
  }

  async play(game) {
    if (game.plays.length < 2)
      return this.opening(game.board)

    return this.best(game.board)
  }

  opening(board) {
    const s = board.size - 1
    const corners = [
      new Coords(0, 0),
      new Coords(s, s),
    ]

    const empty_corner = corners.find(c => board.square(c).empty())

    return new Place.Flat(empty_corner)
  }

  best(board) {
    this.reset_cache()

    const start = new Date().getTime()
    const timeout = start + this.think_time_ms
    const sorted = this.legal_plays(board)
    const info = { searched: 0, tree: {} }
    this.debug.push(info)

    let chosen = null
    let depth = 0
    for (; depth <= this.level; depth++) {
      const branch = info.tree[depth] = []

      const plays = this.best_plays(
        board,
        depth,
        sorted,
        timeout,
        info,
        branch)

      if (!plays.length) break

      chosen = plays[Math.floor(this.random() * plays.length)]
      sorted.sort((a, b) => {
        if (plays.indexOf(a) > -1) return -1
        if (plays.indexOf(b) > -1) return 1
        return 0
      })
    }

    this.add_comment(start, info, chosen)

    return chosen
  }

  best_plays(board, depth, sorted, timeout, info, root) {
    let plays = []

    let best = -Infinity
    for (const play of sorted || this.legal_plays(board)) {
      const branch = []

      board.apply(play)
      const searched = this.search(
        board,
        depth,
        best,
        Infinity,
        timeout,
        info,
        branch)
      board.revert(play)

      if (searched == TIMEOUT) break
      const score = -searched

      if (root) root.push({ play: play.ptn(), score, branch })
      play.comment = `${score}@${depth}`

      if (score == best) plays.push(play)
      if (score > best) {
        best = score
        plays = [play]
      }
    }

    return plays
  }

  search(board, depth, alpha, beta, timeout, info, root) {
    if (info) info.searched++

    const evaluation = this.evaluate(board)

    if (!depth)
      return evaluation
    if (evaluation >= GAME_OVER)
      return evaluation + depth * 100
    if (evaluation <= -GAME_OVER)
      return evaluation - depth * 100

    if (timeout && new Date().getTime() > timeout)
      return TIMEOUT

    for (const play of this.legal_plays(board)) {
      const branch = []

      board.apply(play)
      const searched = this.search(
        board,
        depth - 1,
        -beta,
        -alpha,
        timeout,
        info,
        branch)
      board.revert(play)

      if (searched == TIMEOUT) return TIMEOUT
      const score = -searched

      if (root) root.push({ play: play.ptn(), score, branch })
      if (this.pruning && score >= beta) return beta
      if (score > alpha) alpha = score
    }

    return alpha
  }

  evaluate(board) {
    const key = board.fingerprint()
    if (key in this.evaluation_cache)
      return this.evaluation_cache[key]

    let over = 0
    const game_over = board.game_over()
    if (game_over instanceof Win)
      over = game_over.color == 'white'
        ? GAME_OVER
        : -GAME_OVER

    const stash_diff = board.black.count()
      - board.white.count()

    const { white, black } = board.flat_count()
    const flat_diff = white - black

    const chain_diff = this.chains(board, 'white')
      - this.chains(board, 'black')

    const evaluation = 0
      + stash_diff * 10
      + flat_diff * 50
      + chain_diff * 10
      + over

    let relative = board.turn == 'white'
      ? evaluation
      : -evaluation

    if (!over && this.tak(board))
      relative -= 100

    this.evaluation_cache[key] = relative
    return relative
  }

  legals(board) {
    if (board.game_over()) return []

    const plays = []
    for (const square of board.squares_list) {
      if (square.empty())
        place(square)
      else if (square.top().color == board.turn)
        move(square)
    }

    return plays

    function place(square) {
      if (board[board.turn].stones.length)
        plays.push(
          new Place.Flat(square.coords),
          new Place.Wall(square.coords))

      if (board[board.turn].caps.length)
        plays.push(
          new Place.Cap(square.coords))
    }

    function move(square) {
      const height = Math.min(board.size, square.pieces.length)
      const droppings = []
      for (let take = 1; take <= height; take++) {
        droppings.push(...spread([], take))
      }

      for (const dir in Move.directions) {
        const d = Move.directions[dir]

        let max = 0
        let target = square.coords.moved(d)
        while (droppable(target)) {
          max++
          target = target.moved(d)
        }

        for (const dropping of droppings) {
          if (dropping.length > max
            && !smashable(dropping, max, target))
            continue

          plays.push(new Move(square.coords)
            .to(dir)
            .dropping(dropping))
        }
      }

      function droppable(coords) {
        if (!(coords.name in board.squares)) return false
        const s = board.square(coords)
        const top = s.top()
        if (top instanceof Cap) return false
        if (!top || !top.standing) return true
        return false
      }

      function smashable(dropping, max, target) {
        return dropping.length == max + 1
          && square.top() instanceof Cap
          && dropping.slice(-1)[0] == 1
          && target.name in board.squares
          && board.square(target).top().standing
      }
    }

    function spread(drops, last) {
      if (!last) return [drops]

      const spreads = []
      for (let take = 0; take < last; take++) {
        spreads.push(...spread([...drops, last - take], take))
      }

      return spreads
    }
  }
}