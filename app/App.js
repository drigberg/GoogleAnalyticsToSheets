/**
 * Module dependencies
 */

import React, { Component } from 'react';
import Form from './components/Form';
import Console from './components/Console';
import Readme from './components/Readme';
import ToggleReadme from './components/ToggleReadme';

// import logo from './logo.svg';
import './main.css';

const fs = window.require('fs');
const path = window.require('path');
const google = window.require('googleapis');
const GoogleAuth = window.require('google-auth-library');
const Store = window.require('electron-store');
const store = new Store();

/**
 * Constants
 */

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
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
    this.state = {};

    this.fetchAndSend = this.fetchAndSend.bind(this);
    this.fetchEnv = this.fetchEnv.bind(this);
    this.writeToConsole = this.writeToConsole.bind(this);
    this.getAnalyticsData = this.getAnalyticsData.bind(this);
    this.parseAnalyticsResponse = this.parseAnalyticsResponse.bind(this);
    this.writeToSheet = this.writeToSheet.bind(this);
    this.queryForNewToken = this.queryForNewToken.bind(this);
    this.createClient = this.createClient.bind(this);
    this.readToken = this.readToken.bind(this);
    this.handleTokenInput = this.handleTokenInput.bind(this);
    this.saveSheetsKey = this.saveSheetsKey.bind(this);
    this.saveAnalyticsKey = this.saveAnalyticsKey.bind(this);
    this.getAnalyticsKeyPath = this.getAnalyticsKeyPath.bind(this);
  }

  componentDidMount() {
    this.getAnalyticsKeyPath();
    this.createClient();
    this.readToken();
  }

  fetchAndSend() {
    this.writeToConsole('\n------\n');
    this.fetchEnv()
      .then(() => {
        const dateRange = this.form.getDateRange();

        if (!dateRange) {
          this.writeToConsole('Please be sure that date range is provided, and that start is before end.');

          return null;
        }

        return this.getAnalyticsData(dateRange)
          .then((data) => {
            if (!data) {
              this.writeToConsole('Error: no data received');
            }

            const parsedData = this.parseAnalyticsResponse(data, dateRange);

            this.writeToConsole('Got analytics data!\nReading sheets client file...');
            const writer = this.writeToSheet(parsedData);

            const oauth2Client = Object.assign(
              this.form.state.oauth2Client,
              { credentials: this.form.state.oauthToken }
            );

            console.log(oauth2Client)

            return writer(oauth2Client);
          });
      })
      .catch((err) => {
        this.writeToConsole(`Error: ${err.message}`);
        console.log(err);
      });
  }

  saveSheetsKey() {
    const el = document.getElementById('sheetsKeyLoad');
    const filepath = el.files[0].path;

    fs.readFile(filepath, (err, content) => {
      if (err) {
        this.writeToConsole(`Error loading client secret file: ${err.message}`);
      }

      const sheetsKey = JSON.parse(content);

      store.set('sheetsKey', sheetsKey);
      this.createClient(sheetsKey);
    });
  }

  getAnalyticsKeyPath() {
    const filepath = store.get('analyticsKeyPath');
    if (!filepath) {
      this.writeToConsole('Failed to load analytics secret file');
      return;
    }

    const newFormState = Object.assign(this.form.state, { analyticsKeyPath: filepath });
    this.form.setState(newFormState);
  }

  saveAnalyticsKey() {
    const el = document.getElementById('analyticsKeyLoad');
    const filepath = el.files[0].path;

    const newFormState = Object.assign(this.form.state, { analyticsKeyPath: filepath });
    this.form.setState(newFormState);

    store.set('analyticsKeyPath', filepath);
  }


  createClient(sheetsKey) {
    sheetsKey = sheetsKey || store.get('sheetsKey');

    if (!sheetsKey) {
      this.writeToConsole('Error loading sheets key');
      return;
    }

    this.writeToConsole('Successfully loaded sheets key!');

    // Authorize a client with the loaded credentials, then call the
    // Google Sheets API.
    const clientId = sheetsKey.installed.client_id;
    const clientSecret = sheetsKey.installed.client_secret;
    const redirectUrl = sheetsKey.installed.redirect_uris[0];

    const auth = new GoogleAuth();
    const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    const newFormState = Object.assign({}, this.form.state, { oauth2Client });
    return this.form.setState(newFormState);
  }

  /**
   * Get credentials
   */
  readToken() {
    const token = store.get('authToken');

    if (!token) {
      this.queryForNewToken();
      return;
    }

    const newFormState = Object.assign({}, this.form.state, { oauthToken: token });

    this.form.setState(newFormState);
  }

  /**
   * Ask user for new auth token
   *
   * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback to call with the authorized
   *     client.
   */
  queryForNewToken() {
    const oauth2Client = this.form.state.oauth2Client;
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    });

    this.writeToConsole(`Authorize this app by visiting this url: ${authUrl} \nEnter that code here in the input bar below and then hit enter.`);
    this.console.showInput('handleTokenInput');
  }

  handleTokenInput(input) {
    this.form.state.oauth2Client.getToken(input, (err, token) => {
      if (err) {
        this.writeToConsole('Error while trying to retrieve access token', err);
        return;
      }

      const newClient = this.form.state.oauth2Client;
      newClient.credentials = token;
      const newState = Object.assign({}, this.state, { oauth2Client: newClient });

      this.form.setState(newState);

      return store.set('authToken', token);
    });
  }

  writeToSheet(data) {
    return (authClient) => {
      console.log(authClient)
      this.writeToConsole('\nSending data to Sheets API...');
      const body = {
        values: [data.headers, ...data.rows]
      };

      const sheets = google.sheets('v4');

      sheets.spreadsheets.values.append({
        auth: authClient,
        spreadsheetId: this.form.state.ids.spreadsheet,
        range: 'AllData!A1:Z',
        valueInputOption: 'RAW',
        resource: body
      }, (err, res) => {
        if (err) {
          this.writeToConsole(`Write error: ${err.message}`);
        } else {
          this.writeToConsole(`${res.updates.updatedCells} cells updated in range ${res.updates.updatedRange}.\n`);
        }
      });
    };
  }

  parseAnalyticsResponse(data, dateRange) {
    const ret = { rows: [] };

    data.reports.forEach((report) => {
      const header = report.columnHeader;
      const dimensionHeaders = (header && header.dimensions) || [];
      const metricHeaders = ((header && header.metricHeader && header.metricHeader.metricHeaderEntries) || [])
        .map(item => item.name);

      const headers = [
        'Date Range Start',
        'Date Range End',
        ...metricHeaders,
        ...dimensionHeaders
      ]
        .map($header => $header.replace('ga:', ''));

      Object.assign(ret, { headers });

      report.data.rows.forEach((row) => {
        const dimensions = row.dimensions || [];
        const metrics = row.metrics || [];

        for (let i = 0; i < metrics.length; i++) {
          const metric = metrics[i];
          ret.rows.push([dateRange.start, dateRange.end, ...metric.values, ...dimensions]);
        }
      });
    });

    return ret;
  }

  fetchEnv() {
    this.writeToConsole('Checking for spreadsheet and view ids...');

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
            this.writeToConsole('No info saved.');

            return;
          }

          env = {
            spreadsheetId: res[0],
            viewId: res[1]
          };

          this.writeToConsole('Saving ids!');

          store.set('env', env);
          return env;
        });
    }

    return promise
      .then((data) => {
        env = env || data;

        const newState = Object.assign({}, this.state, {
          ids: {
            spreadsheet: env.spreadsheetId,
            view: env.viewId
          }
        });

        this.writeToConsole('Got ids!');

        return this.form.setState(newState);
      });
  }

  getAnalyticsData(dateRange) {
    return new Promise((resolve, reject) => {
      this.writeToConsole(`Getting analytics data with view id ${this.form.state.ids.view}`);

      const metrics = this.form.metrics.join('-') || 'sessions';
      const dimensions = this.form.dimensions.join('-') || 'city-country';

      const subpy = window.require('child_process').spawn('python', [
        // dear god please this needs to be cleaned somehow
        path.join(window.__dirname, '../public/analytics.py'),
        this.form.state.ids.view,
        this.form.state.analyticsKeyPath,
        metrics,
        dimensions,
        dateRange.start,
        dateRange.end
      ]);

      let pyData = '';

      subpy.stdout.on('data', (chunk) => {
        pyData += chunk.toString().replace(/u'/g, "'").replace(/'/g, '"'); // buffer to string
      });

      subpy.stdout.on('end', () => {
        pyData = pyData.replace('", u "', '", "'); // fix errors with automatic unicode parsing (eg: ["France", u "Saint-Martin-d"])
        let parsed;

        try {
          parsed = JSON.parse(pyData); // string to object
        } catch (err) {
          reject(new Error('Received error from Google Analytics API -- be sure that your dates make sense and that your dimensions and metrics can be used in combination with each other.'));
        }

        resolve(parsed);
      });

      subpy.stdout.on('error', (err) => {
        reject(err);
      });
    });
  }

  writeToConsole(text) {
    const newConsoleState = Object.assign({}, this.console.state);
    newConsoleState.output += `\n${text}`;

    this.console.setState(newConsoleState);
  }

  render() {
    return (
      <div id="app" style={style}>
        <ToggleReadme parent={this} />
        <h1>Google Analytics 2 Sheets</h1>
        <Form display={this.state.readmeActive ? 'none' : 'block'} parent={this} writeToConsole={this.writeToConsole} />
        <Console display={this.state.readmeActive ? 'none' : 'block'} parent={this} writeToConsole={this.writeToConsole} />
        <Readme display={this.state.readmeActive ? 'block' : 'none'} />
      </div>
    );
  }
}

export default App;
