/**
 * Module dependencies
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Form from './components/Form';
import Console from './components/Console';
import Readme from './components/Readme';
import Stats from './components/Stats';
import MainTabButton from './components/buttons/MainTabButton';
import ReadmeTabButton from './components/buttons/ReadmeTabButton';
import StatsTabButton from './components/buttons/StatsTabButton';

import {
  LOGGER,
  SAVE_ANALYTICS_CLIENT,
  SAVE_SHEETS_CLIENT,
  SAVE_OAUTH_TOKEN,
  SAVE_IDS
} from './constants/actionTypes';

import {
  MAIN_TAB,
  README_TAB,
  STATS_TAB
} from './constants';

// import logo from './logo.svg';
import './main.css';

const fs = window.require('fs');
const google = window.require('googleapis');
const GoogleAuth = window.require('google-auth-library');
const Store = window.require('electron-store');
const store = new Store();

/**
 * Constants
 */

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const style = {
  padding: '10px'
};

/**
 * Module
 */

const mapDispatchToProps = dispatch => ({
  saveSheetsClient: client => dispatch({
    type: SAVE_SHEETS_CLIENT,

    client
  }),
  saveAnalyticsClient: client => dispatch({
    type: SAVE_ANALYTICS_CLIENT,
    client
  }),
  saveOAuthToken: (token) => dispatch({
    type: SAVE_OAUTH_TOKEN,
    token
  }),
  saveIds: (ids) => dispatch({
    type: SAVE_IDS,
    ids
  }),
  logger: (text) => dispatch({
    type: LOGGER,
    text
  })
});

const mapStateToProps = state => {
  const { clients, console, form, ids, readme, tab } = state;

  return { clients, console, form, ids, readme, tab };
};

class App extends Component {
  constructor() {
    super();

    this.fetchAndSend = this.fetchAndSend.bind(this);
    this.fetchEnv = this.fetchEnv.bind(this);
    this.getAnalyticsData = this.getAnalyticsData.bind(this);
    this.parseAnalyticsResponse = this.parseAnalyticsResponse.bind(this);
    this.writeToSheet = this.writeToSheet.bind(this);
    this.queryForNewToken = this.queryForNewToken.bind(this);
    this.createSheetsClient = this.createSheetsClient.bind(this);
    this.readToken = this.readToken.bind(this);
    this.handleTokenInput = this.handleTokenInput.bind(this);
    this.saveSheetsKey = this.saveSheetsKey.bind(this);
    this.saveAnalyticsKey = this.saveAnalyticsKey.bind(this);
    this.createAnalyticsClient = this.createAnalyticsClient.bind(this);
  }

  componentDidMount() {
    this.createAnalyticsClient();
    this.createSheetsClient();
    this.readToken();
    this.fetchEnv();
  }

  async fetchAndSend() {
    try {
      this.props.logger('\n------\n');
      const dateRange = this.form.getDateRange();

      if (!dateRange) {
        this.props.logger('Please be sure that date range is provided, and that start is before end.');

        return null;
      }

      const data = await this.getAnalyticsData(dateRange);

      if (!data) {
        this.props.logger('Error: no data received');
      }

      const parsedData = this.parseAnalyticsResponse(data, dateRange);

      this.props.logger('Got analytics data!\nReading sheets client file...');
      const writer = this.writeToSheet(parsedData);

      const sheetsClient = Object.assign(
        this.props.clients.sheets,
        { credentials: this.props.clients.oauthToken }
      );

      return writer(sheetsClient);
    } catch (err) {
      this.props.logger(`Error: ${err.message}`);
      console.log(err);
    }
  }

  saveSheetsKey() {
    const el = document.getElementById('sheetsKeyLoad');
    const filepath = el.files[0].path;

    fs.readFile(filepath, (err, content) => {
      if (err) {
        this.props.logger(`Error loading sheets key: ${err.message}`);
      }

      const key = JSON.parse(content);

      this.props.logger('Successfully loaded sheets key!');

      store.set('sheetsKey', key);
      this.createSheetsClient(key);
    });
  }

  saveAnalyticsKey() {
    const el = document.getElementById('analyticsKeyLoad');
    const filepath = el.files[0].path;

    fs.readFile(filepath, (err, content) => {
      if (err) {
        this.props.logger(`Error loading analytics key: ${err.message}`);
      }

      const key = JSON.parse(content);

      this.props.logger('Successfully loaded analytics key!');

      store.set('analyticsKey', key);
      this.createAnalyticsClient(key);
    });
  }

  createAnalyticsClient(key) {
    key = key || store.get('analyticsKey');

    if (!key) {
      this.props.logger('Error loading analytics key');
      return;
    }

    const analyticsClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      ['https://www.googleapis.com/auth/analytics.readonly'],
      null
    );

    analyticsClient.authorize((err, tokens) => { // eslint-disable-line no-unused-vars
      if (err) {
        console.log(err);
        return;
      }

      this.props.saveAnalyticsClient(analyticsClient);
    });
  }


  createSheetsClient(sheetsKey) {
    sheetsKey = sheetsKey || store.get('sheetsKey');

    if (!sheetsKey) {
      this.props.logger('Error loading sheets key');
      return;
    }

    // Authorize a client with the loaded credentials, then call the
    // Google Sheets API.
    const clientId = sheetsKey.installed.client_id;
    const clientSecret = sheetsKey.installed.client_secret;
    const redirectUrl = sheetsKey.installed.redirect_uris[0];

    const auth = new GoogleAuth();
    const sheetsClient = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    this.props.saveSheetsClient(sheetsClient);
  }

  /**
   * Get credentials
   */
  readToken() {
    const token = store.get('oauthToken');

    if (!token) {
      this.queryForNewToken();
      return;
    }

    this.props.saveOAuthToken(token);
  }

  /**
   * Ask user for new auth token
   *
   * @param {google.auth.OAuth2} sheetsClient The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback to call with the authorized
   *     client.
   */
  queryForNewToken() {
    const { clients } = this.props;
    if (!clients || !clients.sheets) {
      return;
    }
    const authUrl = clients.sheets.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });

    this.props.logger(`Authorize this app by visiting this url: ${authUrl} \nEnter that code here in the input bar below and then hit enter.`);

    setTimeout(() => this.console.showInput('handleTokenInput'), 200);
  }

  handleTokenInput(input) {
    const { clients } = this.props;

    clients.sheets.getToken(input, (err, token) => {
      if (err) {
        this.props.logger('Error while trying to retrieve access token', err);
        return;
      }

      this.props.saveOAuthToken(token);
    });
  }

  writeToSheet(data) {
    return (authClient) => {
      this.props.logger('\nSending data to Sheets API...');
      const body = {
        values: [data.headers, ...data.rows]
      };

      const sheets = google.sheets('v4');

      sheets.spreadsheets.values.append({
        auth: authClient,
        spreadsheetId: this.props.ids.spreadsheet,
        range: 'AllData!A1:Z',
        valueInputOption: 'RAW',
        resource: body
      }, (err, res) => {
        if (err) {
          this.props.logger(`Write error: ${err.message}`);
        } else {
          this.props.logger(`${res.updates.updatedCells} cells updated in range ${res.updates.updatedRange}.\n`);
        }
      });
    };
  }

  parseAnalyticsResponse(data, dateRange) {
    const ret = {};

    const headers = data.columnHeaders.map(header => header.name);
    ret.headers = ['Date Range Start', 'Date Range End', ...headers];
    ret.rows = data.rows.map(row => [dateRange.start, dateRange.end, ...row]);

    return ret;
  }

  async fetchEnv() {
    let env = store.get('env');

    if (!env) {
      const questions = [
        'What is the id of your Google Sheet?',
        'What is your view id?'
      ];

      const res = await this.console.multipleDialogs(questions);

      if (!res[0] || !res[1]) {
        this.props.logger('Cancelled. No info saved.');

        return;
      }

      env = {
        spreadsheetId: res[0],
        viewId: res[1]
      };
    }


    store.set('env', env);

    return this.props.saveIds({
      spreadsheet: env.spreadsheetId,
      view: env.viewId
    });
  }

  getAnalyticsData(dateRange) {
    const { clients } = this.props;

    this.props.logger(`Getting analytics data with view id ${this.props.ids.view}`);

    const { form } = this.props;

    let metrics = form.metrics.map(metric => `ga:${metric}`).join(',');
    let dimensions = form.dimensions.map(metric => `ga:${metric}`).join(',');

    if (!metrics) {
      metrics = 'ga:sessions';
    }

    if (!dimensions) {
      dimensions = 'ga:city,ga:country';
    }

    const analytics = google.analytics('v3');

    return new Promise((resolve, reject) => {
      analytics.data.ga.get({
        auth: clients.analytics,
        ids: `ga:${this.props.ids.view}`,
        metrics,
        dimensions,
        'start-date': dateRange.start,
        'end-date': dateRange.end,
      }, (err, response) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(response);
      });
    });
  }

  render() {
    const { tab } = this.props;

    const showIf = (expected) => {
      if (tab === expected) {
        return 'block';
      }

      return 'none';
    };

    return (
      <div id="app" style={style}>
        <MainTabButton parent={this} />
        <ReadmeTabButton parent={this} />
        <StatsTabButton parent={this} />

        <h1>Google Analytics 2 Sheets</h1>

        <Form display={showIf(MAIN_TAB)} parent={this} />
        <Console display={showIf(MAIN_TAB)} parent={this} />
        <Readme display={showIf(README_TAB)} />
        <Stats display={showIf(STATS_TAB)} />
      </div>
    );
  }
}

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

export default ConnectedApp;
