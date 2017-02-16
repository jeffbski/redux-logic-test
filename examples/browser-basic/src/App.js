import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from './logo.svg';
import './App.css';

function DisplayAnswer({ answer }) {
  return (
    <section>
      Answer: { answer }
    </section>
  );
}
const CDisplayAnswer = connect(
  state => ({
    answer: state.answer
  })
)(DisplayAnswer);

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <CDisplayAnswer />
      </div>
    );
  }
}

export default App;
