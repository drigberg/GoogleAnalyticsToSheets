import React, { Component } from 'react';
import { connect } from 'react-redux';
import Checkbox from './Checkbox';
import { addCheckbox, removeCheckbox } from '../actions';

const styles = {
  dates: {
    margin: '10px 0px'
  }
};

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.props.parent.form = this;

    this.handleInputChange = this.handleInputChange.bind(this);
    this.fetchAndSend = this.fetchAndSend.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;

    if (target.checked) {
      this.props.dispatch(addCheckbox(target.className, target.name));
      return;
    }

    this.props.dispatch(removeCheckbox(target.className, target.name));
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

  render() {
    const { clients } = this.props;

    const haveOAuth = clients && clients.oauthToken;
    const haveSheetsKey = clients && clients.sheets;
    const haveAnalyticsKey = clients && clients.analytics;

    const readyForSend = haveOAuth && haveSheetsKey && haveAnalyticsKey;

    return (
      <form style={{ display: this.props.display }} id="form">
        <div>
          <h3>Metrics</h3>
          <Checkbox className="metrics" name="sessions" clickHandler={this.handleInputChange} />
          <Checkbox className="metrics" name="users" clickHandler={this.handleInputChange} />
          <Checkbox className="metrics" name="bounceRate" clickHandler={this.handleInputChange} />
          <Checkbox className="metrics" name="pageLoadTime" clickHandler={this.handleInputChange} />
          <Checkbox className="metrics" name="timeOnPage" clickHandler={this.handleInputChange} />
          <Checkbox className="metrics" name="pageviewsPerSession" clickHandler={this.handleInputChange} />
          <Checkbox className="metrics" name="sessionDuration" clickHandler={this.handleInputChange} />
        </div>

        <div>
          <h3>Dimensions</h3>
          <Checkbox className="dimensions" name="screenResolution" clickHandler={this.handleInputChange} />
          <Checkbox className="dimensions" name="source" clickHandler={this.handleInputChange} />
          <Checkbox className="dimensions" name="referralPath" clickHandler={this.handleInputChange} />
          <Checkbox className="dimensions" name="keyword" clickHandler={this.handleInputChange} />
          <Checkbox className="dimensions" name="city" clickHandler={this.handleInputChange} />
          <Checkbox className="dimensions" name="country" clickHandler={this.handleInputChange} />
          <Checkbox className="dimensions" name="browser" clickHandler={this.handleInputChange} />
          <Checkbox className="dimensions" name="operatingSystem" clickHandler={this.handleInputChange} />
          <Checkbox className="dimensions" name="userType" clickHandler={this.handleInputChange} />
        </div>

        <div style={styles.dates} id="dates">
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
          <button type="button" onClick={this.props.parent.queryForNewToken}>Get New Auth Token</button>
          <label htmlFor="analyticsKeyLoad">
            Load New Analytics Key
            <input
              type="file"
              name="analyticsKeyLoad"
              id="analyticsKeyLoad"
              onChange={this.props.parent.saveAnalyticsKey}
            />
          </label>

          <label htmlFor="sheetsKeyLoad">
            Load New Sheets Key
            <input
              type="file"
              name="sheetsKeyLoad"
              id="sheetsKeyLoad"
              onChange={this.props.parent.saveSheetsKey}
            />
          </label>
        </div>
      </form>
    );
  }
}

const mapStateToProps = state => {
  const { form, clients } = state;

  return { form, clients };
};

const ConnectedForm = connect(mapStateToProps)(Form);

export default ConnectedForm;
