import React, { useState } from 'react';

function Tile(props) {

  const [activeTile, setActiveTile] = useState(false);

  const x = props.rowNumber;
  const y = props.columnNumber;

  function handleClick() {
    let newLayout = props.values.layout.slice()
    if (activeTile) {
      props.setters.setBeeCount(props.values.beeCount - 1)
      newLayout[x][y] = false
    } else {
      props.setters.setBeeCount(props.values.beeCount + 1)
      newLayout[x][y] = true
    }
    setActiveTile(!activeTile);
    props.setters.setLayout(newLayout)
  }

  return (
    <div className={`hexagon ${activeTile ? 'buzz' : ''}`} onClick={handleClick}>
    </div>
  )
}

function Row(props) {

  const tiles = []
  for (let i = 0; i < props.tileCount; i++) {
    tiles.push(
      <Tile key={props.rowNumber.toString() + i.toString()} columnNumber={i} rowNumber={props.rowNumber} setters={props.setters} values={props.values} />
    )
  }

  return (
    <div className="row">
      {tiles}
    </div>
  )
}

function BeeCounter(props) {
  return (
    <div className="counter-container">
        <p className="bee-counter">Bees Placed: {props.beeCount}</p>
    </div>
  )
}

function TurnCounter(props) {
  return (
    <div className="counter-container">
        <p className="turn-counter">Rounds Passed: {props.turnCount}</p>
    </div>
  )
}

function Board() {

  function createLayout() {
    const layout = []
    let reverse = false;
    let base_number = 11;
    for (let i = 0; i < 11; i++) { // rows
        let row = [];
        for (let j = 0; j < base_number; j++) { // tiles
            row.push(false);
        }
        layout.push(row);
        if (base_number < 16 && !reverse) {
            base_number+= 1;
        } else if (base_number === 16) {
            reverse = true;
            base_number-= 1;
        } else {
            base_number-= 1;
        }
    }
    return layout
  }

  const [layout, setLayout] = useState(createLayout());
  const [beeCount, setBeeCount] = useState(0);
  const [turnCount, setTurnCount] = useState(0);
  const setters = {setLayout: setLayout,
                   setBeeCount: setBeeCount,}
  const values = {layout: layout,
                  beeCount: beeCount,}
  const rows = []
  for (let row of layout) {
    rows.push(
      <Row key={rows.length.toString()} tileCount={row.length} rowNumber={rows.length} setters={setters} values={values} />
    )
  }

  return (
    <div className="hive">
      <BeeCounter beeCount={beeCount} />
      {rows}
      <TurnCounter turnCount={turnCount} />
    </div>
  )
}

export default Board;