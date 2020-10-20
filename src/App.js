import React from 'react';
import Board from './components/board.js'
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="page-heading">
          <h1 className="page-title">Beehive Puzzle</h1>
          <h3 className="subtitle">How efficiently can you repopulate the hive?</h3>
          <a className="rules-link" href="instructions.html" target="_blank">Instructions</a>
      </div>
      <Board />
    </div>
  );
}

export default App;
