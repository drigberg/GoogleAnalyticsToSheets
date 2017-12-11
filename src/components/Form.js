import React, { Component } from 'react';
import Checkbox from './Checkbox';
// import analytics from './helpers/analytics';
// import helpers from './helpers/helpers';
// import sheets from './helpers/sheets';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metric: {},
      dimension: {}
    };

    this.props.parent.form = this;

    this.handleInputChange = this.handleInputChange.bind(this);
    this.fetchAndSend = this.fetchAndSend.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    const newState = Object.assign({}, this.state)
    newState[target.className][target.name] = value

    this.setState(newState);
  }

  fetchAndSend() {
    this.props.parent.fetchAndSend(this.state)
  }

  get metrics() {
    return Array.from(document.getElementsByClassName("metric"))
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.id)
  }

  get dimensions() {
    return Array.from(document.getElementsByClassName("dimension"))
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.id)
  }

  render() {
    const sendEnabled = this.props.client && this.props.client.credentials

    return (
      <form style={{ display: this.props.display }} id="form">
        <div>
          <h3>Metrics</h3>

          <Checkbox className="metric" name="sessions" clickHandler={this.handleInputChange} />
          <Checkbox className="metric" name="pageLoadTime" clickHandler={this.handleInputChange} />
          <Checkbox className="metric" name="timeOnPage" clickHandler={this.handleInputChange} />
        </div>

        <div>
          <h3>Dimensions</h3>

          <Checkbox className="dimension" name="screenResolution" />
          <Checkbox className="dimension" name="city" />
          <Checkbox className="dimension" name="country" />
          <Checkbox className="dimension" name="browser" />
          <Checkbox className="dimension" name="operatingSystem" />
          <Checkbox className="dimension" name="userType" />
        </div>

        <button disabled={sendEnabled} type="button" onClick={this.fetchAndSend}>Fetch and Send</button>
        <button disabled={!sendEnabled} type="button" onClick={this.props.parent.getNewToken}>Get New Auth Token</button>

        <textarea disabled cols="80" rows="20" id="console"></textarea>
        <input type="text" id="console-input"></input>
      </form>
    );
  }
}

export default Form;
