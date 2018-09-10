import React, { Component } from 'react';
import './App.css';
import Contest from './components/contest';

class App extends Component {
  render() {
    return (
      <div className="App">
        
        <h1 className="App-title">Codechef Virtual Contest</h1>
        <p className="App-intro">
          Run past contests of Codechef in virtual mode
        </p>
        <Contest />
      </div>
    );
  }
}

export default App;
