import React, { useState, useEffect} from 'react';
import {processStep, calculateScore, sleep} from '../logic/game.js'

function InstructionModal(props) {

  function closeInstructions() {
    props.setOpen(false)
  }
  return(
    <div className={`instruction-modal ${props.open ? 'open' : ''}`}>

      <div className="instruction-modal-content">
        <span className="instruction-modal-close" onClick={closeInstructions} >&times;</span>
        <div class="instruction-list">
          <ul>
              <li>The goal is to repopulate the hive in as few rounds as possible and by placing as few bees as possible.</li>
              <li>You can place a bee on the board by clicking on a hexagonal tile.</li>
              <li>A tile that is touching three bee tiles will be converted into a bee tile.</li>
              <li>When you click simulate tiles will be converted in rounds until either no tiles are converted or the entire hive has been repopulated.</li>
          </ul>
        </div>
      </div>

    </div>
  )
}


function Tile(props) {

  const x = props.rowNumber;
  const y = props.columnNumber;

  const [activeTile, setActiveTile] = useState(false);

  useEffect(() => {
    if (props.values.layout[x][y] !== activeTile) {
      setActiveTile(!activeTile)
    }
  }, [props.values.layout, x, y, activeTile]);


  function handleClick() {
    if (props.values.clickLock) {
      return
    }
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
      <Tile key={props.rowNumber.toString() + '-' + i.toString()} columnNumber={i} rowNumber={props.rowNumber} setters={props.setters} values={props.values} />
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
      newLayout[tile[0]][tile[1]] = true
    });
    props.setters.setLayout(newLayout)
  }

  async function handleClick() {
    if (props.values.clickLock) {
      return
    }
    props.setters.setClickLock(true)
    let turns = 0
    while (true) {
      await sleep(850)
      let [addedBee, beesToAdd] = processStep(props.values.layout)
      if (!addedBee) {
        break
      }
      turns += 1
      addBees(beesToAdd)
      props.setters.setTurnCount(turns)
    }
    props.setters.setGameOver(true)
  }

  return (
    <div className="button-container">
        <button type="button" className="sim-button" onClick={handleClick} >Simulate</button>
    </div>
  )
}

function GameOverOverlay(props) {

  const [gameScore, setGameScore] = useState(0);
  useEffect(() => {
    function cleanUpGameScore() {
      setGameScore(0)
    }
    if (props.values.gameOver) {
      setGameScore(calculateScore(props.values.layout, props.values.beeCount, props.values.turnCount))
    }
    return cleanUpGameScore
  }, [gameScore, props.values.gameOver, props.values.beeCount, props.values.layout, props.values.turnCount]);
  
  return (
    <div className={`overlay overlay-slidedown ${props.values.gameOver ? 'open' : ''}`}>
        <div className="modal">
            <div className="modal-header">
                <h2>Simulation Complete!</h2>
            </div>
            <div className="modal-body">
                <p>Bee Count: {props.values.beeCount}</p>
                <p>Turn Count: {props.values.turnCount}</p>
                <p>Score: {gameScore}</p>
                <button className="restart-button" id="play-again" onClick={props.resetGameFunction} >Play Again</button>
            </div>
        </div>
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
  const [clickLock, setClickLock] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const setters = {setLayout: setLayout,
                   setBeeCount: setBeeCount,
                   setTurnCount: setTurnCount,
                   setClickLock: setClickLock,
                   setGameOver: setGameOver}
  const values = {layout: layout,
                  beeCount: beeCount,
                  turnCount: turnCount,
                  clickLock: clickLock,
                  gameOver: gameOver}
  const hiveRows = []
  for (let row of layout) {
    hiveRows.push(
      <Row key={hiveRows.length.toString()} tileCount={row.length} rowNumber={hiveRows.length} setters={setters} values={values} />
    )
  }

  function openInstructions() {
    setInstructionsOpen(true)
  }

  function resetGame() {
    setLayout(createLayout())
    setGameOver(false)
    setBeeCount(0)
    setTurnCount(0)
    setClickLock(false)
  }

  return (
    <div>
      <div className="page-heading">
        <h1 className="page-title">Beehive Puzzle</h1>
        <h3 className="subtitle">How efficiently can you repopulate the hive?</h3>
        <button className="rules-link" onClick={openInstructions}>Instructions</button>
      </div>
      <div className="hive">
        <BeeCounter beeCount={beeCount} />
        {hiveRows}
        <TurnCounter turnCount={turnCount} />
        <SimulateButton setters={setters} values={values} />
      </div>
      <GameOverOverlay resetGameFunction={resetGame} setters={setters} values={values} />
      <InstructionModal open={instructionsOpen} setOpen={setInstructionsOpen} />
    </div>
  )
}

export default Board;