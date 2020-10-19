import React, { useState } from 'react';

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


function Tile(props) {

  const x = props.rowNumber;
  const y = props.columnNumber;

  return (
    <div className="hexagon">
    </div>
  )
}

function Row(props) {

  const tiles = []
  for (let i = 0; i < props.tileCount; i++) {
    tiles.push(
      <Tile columnNumber={i} rowNumber={props.rowNumber} />
    )
  }

  return (
    <div className="row">
      {tiles}
    </div>
  )
}

function Board() {

  const [layout, setLayout] = useState(createLayout());
  const rows = []
  for (let row of layout) {
    rows.push(
      <Row tileCount={row.length} rowNumber={rows.length} />
    )
  }

  return (
    <div className="hive">
      {rows}
    </div>
  )
}

export default Board;