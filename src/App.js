import React, { Component } from 'react';
import Metric from './components/Metric';
import Dimension from './components/Dimension';
import logo from './logo.svg';
import './main.css';

class App extends Component {
  render() {
    return (
      <div id="app">
        <h1>Google Analytics 2 Sheets</h1>

        <div>
          <div>
            <h3>Metrics</h3>

            <Metric name="sessions" />
            <Metric name="pageLoadTime" />
            <Metric name="timeOnPage" />
          </div>

          <div>
            <h3>Dimensions</h3>

            <Dimension name="screenResolution" />
            <Dimension name="city" />
            <Dimension name="country" />
            <Dimension name="browser" />
            <Dimension name="operatingSystem" />
            <Dimension name="userType" />
          </div>
        </div>

        <button type="button">Fetch and Send</button>

        <textarea disabled cols="80" rows="20" id="console"></textarea>
        <input type="text" id="console-input"></input>
      </div>
    );
  }
}

export default App;
