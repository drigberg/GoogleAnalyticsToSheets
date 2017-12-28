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
    let oauthTokenDiv = <p>Status: Missing</p>;
    let analyticsKeyDiv = <p>Status: Missing</p>;
    let sheetsKeyDiv = <p>Status: Missing</p>;
    let spreadsheetIdDiv = <p>Status: Missing</p>;
    let viewIdDiv = <p>Status: Missing</p>;

    const analytics = this.props.clients.analytics;
    const sheets = this.props.clients.sheets;
    const oauthToken = this.props.clients.oauthToken;
    const spreadsheetId = this.props.ids.spreadsheet;
    const viewId = this.props.ids.view;

    if (spreadsheetId) {
      spreadsheetIdDiv = <p style={tabStyle}>Value: {spreadsheetId}</p>;
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
        <p>View Id</p> {viewIdDiv}
        <p>Analytics Key</p> {analyticsKeyDiv}
        <p>Sheets Key</p> {sheetsKeyDiv}
        <p>OAuth Token</p> {oauthTokenDiv}
      </div>
    );
  }
}

const ConnectedStats = connect(mapStateToProps)(Stats);

export default ConnectedStats;

