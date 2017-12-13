import React, { Component } from 'react';
import Checkbox from './Checkbox';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metric: {},
      dimension: {},
      oauth2Client: {}
    };

    this.props.parent.form = this;

    this.handleInputChange = this.handleInputChange.bind(this);
    this.fetchAndSend = this.fetchAndSend.bind(this);
    this.saveSheetsKey = this.saveSheetsKey.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    const newState = Object.assign({}, this.state);
    newState[target.className][target.name] = value;

    this.setState(newState);
  }

  fetchAndSend() {
    this.props.parent.fetchAndSend(this.state);
  }

  getDateRange() {
    // temp catch
    if (!document.getElementById('dateStart') || !document.getElementById('dateStart')) {
      return null;
    }

    const start = document.getElementById('dateStart').value;
    const end = document.getElementById('dateEnd').value;

    if (!start || !end || Date.parse(end) < Date.parse(start)) {
      return null;
    }

    return { start, end };
  }

  get metrics() {
    return Array.from(document.getElementsByClassName('metric'))
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.id);
  }

  get dimensions() {
    return Array.from(document.getElementsByClassName('dimension'))
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.id);
  }

  saveSheetsKey() {
    const el = document.getElementById('sheetsKeyLoad');
    console.log(el.files[0].path);
    // document.getElementsByTagName('input')[0].files[0].path
    // console.log(value)
  }

  render() {
    const readyForSend = this.state.oauth2Client && this.state.oauth2Client.credentials;
    return (
      <form style={{ display: this.props.display }} id="form">
        <div>
          <h3>Metrics</h3>

          <Checkbox className="metric" name="sessions" clickHandler={this.handleInputChange} />
          <Checkbox className="metric" name="users" clickHandler={this.handleInputChange} />
          <Checkbox className="metric" name="bounceRate" clickHandler={this.handleInputChange} />
          <Checkbox className="metric" name="pageLoadTime" clickHandler={this.handleInputChange} />
          <Checkbox className="metric" name="timeOnPage" clickHandler={this.handleInputChange} />
          <Checkbox className="metric" name="pageviewsPerSession" clickHandler={this.handleInputChange} />
          <Checkbox className="metric" name="sessionDuration" clickHandler={this.handleInputChange} />
        </div>

        <div>
          <h3>Dimensions</h3>
          <Checkbox className="dimension" name="screenResolution" />
          <Checkbox className="dimension" name="source" />
          <Checkbox className="dimension" name="referralPath" />
          <Checkbox className="dimension" name="keyword" />
          <Checkbox className="dimension" name="city" />
          <Checkbox className="dimension" name="country" />
          <Checkbox className="dimension" name="browser" />
          <Checkbox className="dimension" name="operatingSystem" />
          <Checkbox className="dimension" name="userType" />
        </div>

        <div id="dates">
          <label htmlFor="dateStart">
            Date Range Start
            <input
              type="date"
              name="dateStart"
              id="dateStart"
            />
          </label>
          <label htmlFor="dateEnd">
            Date Range End
            <input
              type="date"
              name="dateEnd"
              id="dateEnd"
            />
          </label>
        </div>

        <button disabled={!readyForSend} type="button" onClick={this.fetchAndSend}>Fetch and Send</button>

        <div id="secrets">
          <button disabled={readyForSend} type="button" onClick={this.props.parent.getNewToken}>Get New Auth Token</button>
          <label htmlFor="analyticsKeyLoad">
            Load New Analytics Key
            <input
              disabled={readyForSend}
              type="file"
              name="analyticsKeyLoad"
              id="analyticsKeyLoad"
            />
          </label>

          <label htmlFor="sheetsKeyLoad">
            Load New Sheets Key
            <input
              disabled={readyForSend}
              type="file"
              name="sheetsKeyLoad"
              id="sheetsKeyLoad"
              onChange={this.saveSheetsKey}
            />
          </label>
        </div>
      </form>
    );
  }
}

export default Form;
