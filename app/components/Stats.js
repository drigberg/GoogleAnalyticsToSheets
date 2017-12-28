import React, { Component } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  const { clients, ids } = state;

  return { clients, ids };
};

const tabStyle = {
  marginLeft: '40px'
};

class Console extends Component {
  render() {
    let oauthTokenDiv = <p>Status: Missing</p>;
    let analyticsKeyDiv = <p>Status: Missing</p>;
    let sheetsKeyDiv = <p>Status: Missing</p>;

    const analytics = this.props.clients.analytics;
    const sheets = this.props.clients.sheets;
    const oauthToken = this.props.clients.oauthToken;

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
      <div style={{ display: this.props.display }}id="stats">
        <p>Analytics Key</p> {analyticsKeyDiv}
        <p>Sheets Key</p> {sheetsKeyDiv}
        <p>OAuth Token</p> {oauthTokenDiv}
      </div>
    );
  }
}

const ConnectedConsole = connect(mapStateToProps)(Console);

export default ConnectedConsole;

