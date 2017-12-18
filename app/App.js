/**
 * Module dependencies
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Form from './components/Form';
import Console from './components/Console';
import Readme from './components/Readme';
import ToggleReadme from './components/ToggleReadme';
import { logger, saveAnalyticsClient, saveIds, saveSheetsClient, saveOAuthToken } from './actions';

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
  }

  fetchAndSend() {
    this.props.dispatch(logger('\n------\n'));
    this.fetchEnv()
      .then(() => {
        const dateRange = this.form.getDateRange();

        if (!dateRange) {
          this.props.dispatch(logger('Please be sure that date range is provided, and that start is before end.'));

          return null;
        }

        return this.getAnalyticsData(dateRange)
          .then((data) => {
            if (!data) {
              this.props.dispatch(logger('Error: no data received'));
            }

            const parsedData = this.parseAnalyticsResponse(data, dateRange);

            this.props.dispatch(logger('Got analytics data!\nReading sheets client file...'));
            const writer = this.writeToSheet(parsedData);

            const sheetsClient = Object.assign(
              this.props.clients.sheets,
              { credentials: this.props.clients.oauthToken }
            );

            return writer(sheetsClient);
          });
      })
      .catch((err) => {
        this.props.dispatch(logger(`Error: ${err.message}`));
        console.log(err);
      });
  }

  saveSheetsKey() {
    const el = document.getElementById('sheetsKeyLoad');
    const filepath = el.files[0].path;

    fs.readFile(filepath, (err, content) => {
      if (err) {
        this.props.dispatch(logger(`Error loading sheets key: ${err.message}`));
      }

      const key = JSON.parse(content);

      this.props.dispatch(logger('Successfully loaded sheets key!'));

      store.set('sheetsKey', key);
      this.createSheetsClient(key);
    });
  }

  saveAnalyticsKey() {
    const el = document.getElementById('analyticsKeyLoad');
    const filepath = el.files[0].path;

    fs.readFile(filepath, (err, content) => {
      if (err) {
        this.props.dispatch(logger(`Error loading analytics key: ${err.message}`));
      }

      const key = JSON.parse(content);

      this.props.dispatch(logger('Successfully loaded analytics key!'));

      store.set('analyticsKey', key);
      this.createAnalyticsClient(key);
    });
  }

  createAnalyticsClient(key) {
    key = key || store.get('analyticsKey');

    if (!key) {
      this.props.dispatch(logger('Error loading analytics key'));
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

      this.props.dispatch(saveAnalyticsClient(analyticsClient));
    });
  }


  createSheetsClient(sheetsKey) {
    sheetsKey = sheetsKey || store.get('sheetsKey');

    if (!sheetsKey) {
      this.props.dispatch(logger('Error loading sheets key'));
      return;
    }

    // Authorize a client with the loaded credentials, then call the
    // Google Sheets API.
    const clientId = sheetsKey.installed.client_id;
    const clientSecret = sheetsKey.installed.client_secret;
    const redirectUrl = sheetsKey.installed.redirect_uris[0];

    const auth = new GoogleAuth();
    const sheetsClient = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    this.props.dispatch(saveSheetsClient(sheetsClient));
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

    this.props.dispatch(saveOAuthToken(token));
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

    this.props.dispatch(logger(`Authorize this app by visiting this url: ${authUrl} \nEnter that code here in the input bar below and then hit enter.`));

    setTimeout(() => this.console.showInput('handleTokenInput'), 200);
  }

  handleTokenInput(input) {
    const { clients } = this.props;

    clients.sheets.getToken(input, (err, token) => {
      if (err) {
        this.props.dispatch(logger('Error while trying to retrieve access token', err));
        return;
      }

      this.props.dispatch(saveOAuthToken(token));
    });
  }

  writeToSheet(data) {
    return (authClient) => {
      this.props.dispatch(logger('\nSending data to Sheets API...'));
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
          this.props.dispatch(logger(`Write error: ${err.message}`));
        } else {
          this.props.dispatch(logger(`${res.updates.updatedCells} cells updated in range ${res.updates.updatedRange}.\n`));
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

  fetchEnv() {
    this.props.dispatch(logger('Checking for spreadsheet and view ids...'));

    let env = store.get('env');
    let promise = Promise.resolve();

    if (!env) {
      const questions = [
        'What is the id of your Google Sheet?',
        'What is your view id?'
      ];

      promise = this.console.multipleDialogs(questions)
        .then((res) => {
          if (!res[0] || !res[1]) {
            this.props.dispatch(logger('No info saved.'));

            return;
          }

          env = {
            spreadsheetId: res[0],
            viewId: res[1]
          };

          this.props.dispatch(logger('Successfully saved ids!'));

          store.set('env', env);
          return env;
        });
    }

    return promise
      .then((data) => {
        env = env || data;

        return this.props.dispatch(saveIds({
          spreadsheet: env.spreadsheetId,
          view: env.viewId
        }));
      });
  }

  getAnalyticsData(dateRange) {
    const { clients } = this.props;

    this.props.dispatch(logger(`Getting analytics data with view id ${this.props.ids.view}`));

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
    const { readme } = this.props;

    return (
      <div id="app" style={style}>
        <ToggleReadme parent={this} />
        <h1>Google Analytics 2 Sheets</h1>
        <Form display={readme.active ? 'none' : 'block'} parent={this} />
        <Console display={readme.active ? 'none' : 'block'} parent={this} />
        <Readme display={readme.active ? 'block' : 'none'} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { clients, console, form, ids, readme } = state;

  return { clients, console, form, ids, readme };
};

const ConnectedApp = connect(mapStateToProps)(App);

export default ConnectedApp;
