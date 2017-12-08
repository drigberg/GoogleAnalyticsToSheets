/**
 * Module dependencies
 */

import React, { Component } from 'react';
import Form from './components/Form';
import Console from './components/Console';

// import logo from './logo.svg';
import './main.css';

const fs = window.require('fs')
const path = window.require('path')
const google = window.require('googleapis')
const googleAuth = window.require('google-auth-library')


/**
 * Constants
 */

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
const ENV_PATH = "./.env.json"
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const TOKEN_DIR = (window.process.env.HOME
  || window.process.env.HOMEPATH
  || window.process.env.USERPROFILE) + '/.credentials/'
const TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json'
const CLIENT_SECRET_PATH = path.join(window.__dirname, '../../../../../../../../sheets_key.json')

/**
 * Module
 */

class App extends Component {
  constructor() {
    super()
    this.ids = {}

    this.fetchAndSend = this.fetchAndSend.bind(this);
    this.fetchEnv = this.fetchEnv.bind(this);
    this.writeToConsole = this.writeToConsole.bind(this);
    this.storeData = this.storeData.bind(this);
    this.getAnalyticsData = this.getAnalyticsData.bind(this);
    this.parseAnalyticsResponse = this.parseAnalyticsResponse.bind(this);
    this.writeToSheet = this.writeToSheet.bind(this);
    this.queryForNewToken = this.queryForNewToken.bind(this);
    this.createClient = this.createClient.bind(this)
    this.readToken = this.readToken.bind(this)
    this.storeToken = this.storeToken.bind(this)
    this.handleTokenInput = this.handleTokenInput.bind(this)

    this.createClient()
    .then(() => {
      this.readToken()
    })
  }

  fetchAndSend(text) {
    this.writeToConsole("\n------\n");
    this.fetchEnv()
      .then(() => {
        return this.getAnalyticsData()
      })
      .then((data) => {
        if (!data) {
          this.writeToConsole("Error: no data received")
        }

        const parsedData = this.parseAnalyticsResponse(data)

        this.writeToConsole("Got analytics data!\nReading sheets client file...")
        const writer = this.writeToSheet(parsedData)

        return writer(this.form.state.oauth2Client);
      })
      .catch((err) => {
        this.writeToConsole(`Error: ${err.message}`)
        console.log(err)
      })
  }


  createClient() {
    return new Promise((resolve, reject) => {
      fs.readFile(CLIENT_SECRET_PATH, (err, content) => {
        if (err) {
          this.writeToConsole(`Error loading client secret file: ${err.message}`)
          reject(err)
        }

        const parsedSecret = JSON.parse(content)

        // Authorize a client with the loaded credentials, then call the
        // Google Sheets API.
        const clientId = parsedSecret.installed.client_id
        const clientSecret = parsedSecret.installed.client_secret
        const redirectUrl = parsedSecret.installed.redirect_uris[0]

        const auth = new googleAuth()
        const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl)

        const newFormState = Object.assign({}, this.form.state, { oauth2Client })
        this.form.setState(newFormState)
        resolve()
      })
    })
  }


  storeToken(token) {
    return this.storeData(token, TOKEN_PATH, TOKEN_DIR)
  }

  /**
   * Get credentials
   */
  readToken() {
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err || !token) {
        this.queryForNewToken()
        return
      }

      const parsedToken = JSON.parse(token)

      const newClient = this.form.state.oauth2Client
      newClient.credentials = parsedToken
      const newFormState = Object.assign({}, this.form.state, { oauth2Client: newClient })

      this.form.setState(newFormState)
    })
  }

  /**
   * Ask user for new auth token
   *
   * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback to call with the authorized
   *     client.
   */
  queryForNewToken(callback) {
    const oauth2Client = this.form.state.oauth2Client
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    })

    this.writeToConsole(`Authorize this app by visiting this url: ${authUrl} \nEnter that code here in the input bar below and then hit enter.`)
    this.console.showInput('handleTokenInput')
  }

  handleTokenInput(input) {
    this.form.state.oauth2Client.getToken(input, (err, token) => {
      if (err) {
        this.writeToConsole('Error while trying to retrieve access token', err)
        return
      }

      const newClient = this.form.state.oauth2Client
      newClient.credentials = token
      const newState = Object.assign({}, this.state, { oauth2Client: newClient })

      this.form.setState(newState)

      return this.storeToken(token)
    })
  }

  writeToSheet(data) {
    return (authClient) => {
      this.writeToConsole("\nSending data to Sheets API...")
      const body = {
        values: [data.headers, ...data.rows]
      }

      const sheets = google.sheets('v4')

      sheets.spreadsheets.values.append({
        auth: authClient,
        spreadsheetId: this.ids.spreadsheet,
        range: "AllData!A1:Z",
        valueInputOption: "RAW",
        resource: body
      }, (err, res) => {
        if (err) {
          this.writeToConsole(`Write error: ${err.message}`)
        } else {
          this.writeToConsole(`${res.updates.updatedCells} cells updated in range ${res.updates.updatedRange}.\n`)
        }
      })
    }
  }

  parseAnalyticsResponse(data) {
    const ret = { rows: [] }

    data.reports.forEach((report) => {
      let dimensionHeaders = (report.columnHeader && report.columnHeader.dimensions) || []
      // let metricHeaders = (report.metricHeader && report.metricHeader.metricHeaderEntries) || []
      let headers = ["Date Range", ...dimensionHeaders, "Sessions"]

      Object.assign(ret, { headers })

      report.data.rows.forEach((row) => {
        let dimensions = row.dimensions || []
        let dateRangeValues = row.metrics || []

        for (let i = 0; i < dateRangeValues.length; i++) {
          let values = dateRangeValues[i]
          ret.rows.push([i, ...dimensions, values.values[0]])
        }
      })
    })

    return ret
  }

  fetchEnv() {
    this.writeToConsole("Checking for spreadsheet id...");

    return new Promise((resolve, reject) => {
      fs.readFile(ENV_PATH, (err, data) => {
        let promise = Promise.resolve()

        if (err || !data) {
          const questions = [
            'What is the id of your Google Sheet?',
            'What is your view id?'
          ]

          promise = this.console.multipleDialogs(questions)
            .then((res) => {
              data = {
                "spreadsheetId": res[0],
                "viewId": res[1]
              }

              this.storeData(JSON.stringify(data), ENV_PATH)
            })
        }

        promise
          .then(() => {
            let keyString = Buffer.isBuffer(data) ? JSON.parse(data) : data
            const parsed = JSON.parse(keyString)
            const parsedTwice = JSON.parse(parsed)

            this.ids.view = parsedTwice.viewId
            this.ids.spreadsheet = parsedTwice.spreadsheetId

            resolve()
          })
      })
    })
  }

  getAnalyticsData() {
    return new Promise((resolve, reject) => {
      this.writeToConsole(`Getting analytics data with view id ${this.ids.view}`)
      const metrics = this.form.metrics.join("-") || "sessions"
      const dimensions = this.form.dimensions.join("-") || "city-country"

      const subpy = window.require('child_process').spawn('python', [
        // dear god please this needs to be cleaned somehow
        path.join(window.__dirname, "../../../../../../../../public/analytics.py"),
        this.ids.view,
        metrics,
        dimensions
      ]);

      let pyData = ""

      subpy.stdout.on('data', (chunk) => {
        pyData += chunk.toString().replace(/u'/g, "'").replace(/'/g, "\"") // buffer to string
      });

      subpy.stdout.on('end', () => {
        pyData = pyData.replace('", u "', '", "') // fix errors with automatic unicode parsing (eg: ["France", u "Saint-Martin-d"])
        const parsed = JSON.parse(pyData); // string to object

        resolve(parsed)
      })

      subpy.stdout.on('error', (err) => {
        reject(err)
      })
    })
  }

  /**
   * Store data to disk be used in later program executions.
   *
   * @param {Object} data The data to store to disk.
   */
  storeData(data, path, dir) {
    return new Promise((resolve, reject) => {
      if (dir) {
        try {
          fs.mkdirSync(dir)
        } catch (err) {
          if (err.code !== 'EEXIST') {
            throw err
          }
        }
      }


      const writeable = JSON.stringify(data)

      fs.writeFile(path, writeable, (err) => {
        if (err) {
          this.writeToConsole("Error saving data:", data)
          reject(err)
        }
        this.writeToConsole('Data stored to ' + path)
        resolve()
      })
    })
}

  writeToConsole(text) {
    let newConsoleState = Object.assign({}, this.console.state);
    newConsoleState.output += `\n${text}`;

    this.console.setState(newConsoleState);
  }

  render() {
    return (
      <div id="app">
        <h1>Google Analytics 2 Sheets</h1>

        <Form parent={this} writeToConsole={this.writeToConsole}/>
        <Console parent={this} writeToConsole={this.writeToConsole}/>
      </div>
    );
  }
}

export default App;
