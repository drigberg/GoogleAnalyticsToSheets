import React, { Component } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  const { clients, ids } = state;

  return { clients, ids };
};

const tabStyle = {
  marginLeft: '40px'
};

class Stats extends Component {
  render() {
    let oauthTokenDiv = <p style={tabStyle}>Status: Missing</p>;
    let analyticsKeyDiv = <p style={tabStyle}>Status: Missing</p>;
    let sheetsKeyDiv = <p style={tabStyle}>Status: Missing</p>;
    let spreadsheetIdDiv = <p style={tabStyle}>Status: Missing</p>;
    let spreadsheetTabDiv = <p style={tabStyle}>Status: Missing</p>;
    let viewIdDiv = <p style={tabStyle}>Status: Missing</p>;

    const analytics = this.props.clients.analytics;
    const sheets = this.props.clients.sheets;
    const oauthToken = this.props.clients.oauthToken;
    const spreadsheetId = this.props.ids.spreadsheet;
    const spreadsheetTab = this.props.ids.spreadsheetTab;

    const viewId = this.props.ids.view;

    if (spreadsheetId) {
      spreadsheetIdDiv = <p style={tabStyle}>Value: {spreadsheetId}</p>;
    }

    if (spreadsheetTab) {
      spreadsheetTabDiv = <p style={tabStyle}>Value: {spreadsheetTab}</p>;
    }

    if (viewId) {
      viewIdDiv = <p style={tabStyle}>Value: {viewId}</p>;
    }

    if (oauthToken) {
      oauthTokenDiv = (
        <div style={tabStyle}>
          <p>Status: Loaded</p>
          <p>{`Expires: ${new Date(oauthToken.expiry_date)}`}</p>
        </div>
      );
    }

    if (sheets) {
      sheetsKeyDiv = <p style={tabStyle}>Status: Loaded</p>;
    }

    if (analytics && analytics.credentials) {
      analyticsKeyDiv = (
        <div style={tabStyle}>
          <p>Status: Loaded</p>
          <p>Email: {analytics.email}</p>
          <p>{`Expires: ${new Date(analytics.credentials.expiry_date)}`}</p>
        </div>
      );
    }

    return (
      <div style={{ display: this.props.display }} id="stats">
        <p>Spreadsheet Id</p> {spreadsheetIdDiv}
        <button type="button" onClick={this.props.parent.getNewSpreadsheetId}>Provide New Spreadsheet Id</button>

        <p>Spreadsheet Tab Name</p> {spreadsheetTabDiv}
        <button type="button" onClick={this.props.parent.getNewSpreadsheetTab}>Provide New Spreadsheet Tab Name</button>

        <p>View Id</p> {viewIdDiv}
        <button type="button" onClick={this.props.parent.getNewViewId}>Provide New View Id</button>

        <p>Analytics Key</p> {analyticsKeyDiv}
        <label htmlFor="analyticsKeyLoad">
          Load New Analytics Key
          <input
            type="file"
            name="analyticsKeyLoad"
            id="analyticsKeyLoad"
            onChange={this.props.parent.saveAnalyticsKey}
          />
        </label>
        <p>Sheets Key</p> {sheetsKeyDiv}
        <label htmlFor="sheetsKeyLoad">
          Load New Sheets Key
          <input
            type="file"
            name="sheetsKeyLoad"
            id="sheetsKeyLoad"
            onChange={this.props.parent.saveSheetsKey}
          />
        </label>
        <p>OAuth Token</p> {oauthTokenDiv}
        <button type="button" onClick={this.props.parent.queryForNewToken}>Get New Auth Token</button>
      </div>
    );
  }
}

const ConnectedStats = connect(mapStateToProps)(Stats);

export default ConnectedStats;

