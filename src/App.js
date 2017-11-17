import React, { Component } from 'react';
import logo from './logo.svg';
import './main.css';

class App extends Component {
  render() {
    return (
      <div id="app">
        <h1>Google Analytics 4 Sheets</h1>

        <div>
          <div>
            <h3>Metrics</h3>

            <input className="metrics" id="sessions" type="checkbox"></input>
            <label htmlFor="sessions">Sessions</label>

            <input className="metrics" id="pageLoadTime" type="checkbox"></input>
            <label htmlFor="pageLoadTime">Page Load Time</label>

            <input className="metrics" id="timeOnPage" type="checkbox"></input>
            <label htmlFor="timeOnpage">Time On Page</label>

          </div>

          <div>
            <h3>Dimensions</h3>

            <input className="dimensions" id="screenResolution" type="checkbox"></input>
            <label htmlFor="screenResolution">Screen resolution</label>

            <input className="dimensions" id="city" type="checkbox"></input>
            <label htmlFor="city">City</label>

            <input className="dimensions" id="country" type="checkbox"></input>
            <label htmlFor="country">Country</label>

            <input className="dimensions" id="browser" type="checkbox"></input>
            <label htmlFor="browser">Browser</label>

            <input className="dimensions" id="operatingSystem" type="checkbox"></input>
            <label htmlFor="operatingSystem">Operating System</label>

            <input className="dimensions" id="userType" type="checkbox"></input>
            <label htmlFor="userType">User Type</label>
          </div>
        </div>

        <button type="button" id="fetch-and-send">Fetch and Send</button>


        <textarea disabled cols="80" rows="20" id="console"></textarea>
        <input type="text" id="console-input"></input>
      </div>
    );
  }
}

export default App;
