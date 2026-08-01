# Taktik

A simple bot to play Tak with.

## Goal

Make all sizes fun and challenging but winnable.

# Rules of Tak

- The *board* is a euqal-sided  grid of 3x3 up to 8x8 *squares*.


- Two *players* take turns playing different colored *pieces*.

- Each player has a *stash* of *stones* and *capstones* of the player's color.

- The *number* of stones and capstones in each stash for different board sizes is 3:10/0, 4:15/0, 5:21/1, 6:30/1, 7:40/2, 8:50/2

- The first player whose pieces form an orthogonally connected *road* between opposite sides of the board wins.

- On your turn, you can either *place* or *move*.

- To place, take one piece from your stash and put it on an empty square.

- Stones can be placed either *flat* or *standing*.

- Standing stones do not count towards roads.

- You can move any *stack* of pieces on the board that you *control*, meaning your piece is on top.

- A stack can move in one orthogonal direction.

- To move a stack, *pick up* one or more pieces, and *drop* at least one piece on each square in the direction of movement.

- The *maximum* number of pieces you can pick up is equal to the number of squares on one side of the board.

- You can drop stones only on *empty* squares or on top of *flats*.

- A Capstone can also be dropped on a standing stone, flattening it.

- If no road is formed by the time either a stash or empty squares run out, the player with the higher *flat count*, meaning flats on top of stacks, wins.

- If a player forms a road for themself and their opponent at the same time, they still win.

- As the first play, the starting player places a flat of the opponents color, and vice versa.
