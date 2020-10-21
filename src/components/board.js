import React, { useState, useEffect } from 'react';
import {processStep} from './game.js'


function Tile(props) {

  const x = props.rowNumber;
  const y = props.columnNumber;

  const [activeTile, setActiveTile] = useState(false);

  useEffect(() => {
    if (props.values.layout[x][y] !== activeTile) {
      setActiveTile(!activeTile)
    }
  });


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

function SimulateButton(props) {

  function addBees(beeList) {
    let newLayout = props.values.layout.slice()
    beeList.forEach((tile, index) => {
      let x = tile[0]
      let y = tile[1]
      newLayout[x][y] = true
      console.log(`bee added at ${x},${y}`)
    });
    props.setters.setLayout(newLayout)
  }

  function handleClick() {
    let turns = 0
    while (true) {
      let [addedBee, beesToAdd] = processStep(props.values.layout)
      if (!addedBee) {
        break
      }
      turns += 1
      addBees(beesToAdd)
      props.setters.setTurnCount(turns)
      console.log('endturn')
    }
  }

  return (
    <div className="button-container">
        <button type="button" className="sim-button" onClick={handleClick} >Simulate</button>
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
                   setBeeCount: setBeeCount,
                   setTurnCount: setTurnCount}
  const values = {layout: layout,
                  beeCount: beeCount,
                  turnCount: turnCount}
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
      <SimulateButton setters={setters} values={values} />
    </div>
  )
}

export default Board;