function *enumerate(iterable) {
  let i = 0;

  for (const x of iterable) {
      yield [i, x];
      i++;
  }
}

export function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

export function processStep(board) {
  let addedBee = false
  let addedBeeList = []
  for (let [count, row] of enumerate(board)) {
      row.forEach((tile, index) => {
          if (!tile) {
              let adjacent_tile_count = 0
              let up_index = (count > 5) ? index + 1 : index - 1
              let down_index = (count > 4) ? index - 1 : index + 1
              if (board[count - 1] !== undefined && board[count - 1][index]) {
                  adjacent_tile_count+= 1
              }
              if (board[count - 1] !== undefined && board[count - 1][up_index]) {
                  adjacent_tile_count+= 1
              }
              if (board[count][index - 1]) {
                  adjacent_tile_count+= 1
              }
              if (board[count][index + 1]) {
                  adjacent_tile_count+= 1
              }
              if (board[count + 1] !== undefined && board[count + 1][index]) {
                  adjacent_tile_count+= 1
              }
              if (board[count + 1] !== undefined && board[count + 1][down_index]) {
                  adjacent_tile_count+= 1
              }
              if (adjacent_tile_count >= 3) {
                  addedBeeList.push([count, index])
                  addedBee = true
              }
          }
      })
  };
  return [addedBee, addedBeeList]
}

export function calculateScore(board, beesAdded, turnsTaken) {
  let totalActiveTiles = 0
  for (let row of board) {
      for (let tile of row) {
          if (tile) {
              totalActiveTiles+= 1
          }
      }
  }
  let missedTiles = 146 - totalActiveTiles
  let beeScore = 146 - (beesAdded * 2)
  let turnScore = (100 - turnsTaken - (missedTiles * 2))
  return beeScore + turnScore
}