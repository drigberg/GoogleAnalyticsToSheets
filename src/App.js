/**
 * Module dependencies
 */

import React, { Component } from 'react';
import Form from './components/Form';
import Console from './components/Console';

// import logo from './logo.svg';
import './main.css';

const fs = window.require('fs');
const path = window.require('path');
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
    this.authorize = this.authorize.bind(this);
    this.getNewToken = this.getNewToken.bind(this);
    this.waitForInputResponse = this.waitForInputResponse.bind(this);
    this.showConsoleInput = this.showConsoleInput.bind(this);
    this.hideConsoleInput = this.hideConsoleInput.bind(this);
    this.readToken = this.readToken.bind(this)

    this.readToken()
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
        fs.readFile(CLIENT_SECRET_PATH, (err, content) => {
          if (err) {
            this.writeToConsole(`Error loading client secret file: ${err.message}`)
            return
          }

          // Authorize a client with the loaded credentials, then call the
          // Google Sheets API.
          const writer = this.writeToSheet(parsedData)
          const parsedSecret = JSON.parse(content)
          this.authorize(parsedSecret, writer)
        })
      })
      .catch((err) => {
        this.writeToConsole(`Error: ${err.message}`)
        console.log(err)
      })
  }

    /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   *
   * @param {Object} credentials The authorization client credentials.
   * @param {Function} callback The callback to call with the authorized client.
   */
  authorize(credentials, callback, callbackData) {
    this.writeToConsole("Getting authorization from Sheets API...")

    const clientId = credentials.installed.client_id
    const clientSecret = credentials.installed.client_secret
    const redirectUrl = credentials.installed.redirect_uris[0]

    const auth = new googleAuth()
    const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl)
    oauth2Client.credentials = this.form.state.oauthToken

    return callback(oauth2Client)
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   *
   * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback to call with the authorized
   *     client.
   */
  getNewTokenOld(oauth2Client, callback) {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    })

    this.writeToConsole(`Authorize this app by visiting this url: ${authUrl}. \nEnter that code here in the input bar below and then hit enter.`)
    return this.waitForInputResponse()
      .then((code) => {
        oauth2Client.getToken(code, (err, token) => {
          if (err) {
            this.writeToConsole('Error while trying to retrieve access token', err)
            return
          }

          oauth2Client.credentials = token
          return this.storeData(token, TOKEN_PATH, TOKEN_DIR)
            .then(() => {
              return callback(oauth2Client)
            })
        })
      })
  }


  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   *
   * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback to call with the authorized
   *     client.
   */
  getNewToken(oauth2Client, callback) {
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    })

    this.writeToConsole(`Authorize this app by visiting this url: ${authUrl}. \nEnter that code here in the input bar below and then hit enter.`)
    return this.waitForInputResponse()
      .then((code) => {
        oauth2Client.getToken(code, (err, token) => {
          if (err) {
            this.writeToConsole('Error while trying to retrieve access token', err)
            return
          }

          oauth2Client.credentials = token
          return this.storeData(token, TOKEN_PATH, TOKEN_DIR)
            .then(() => {
              return callback(oauth2Client)
            })
        })
      })
  }

    /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   *
   * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback to call with the authorized
   *     client.
   */
  readToken(oauth2Client, callback) {
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (token) {
        const parsed = JSON.parse(token)
        const newFormState = Object.assign({}, this.form.state, { oauthToken: parsed })
        this.form.setState(newFormState)
      }
    })
  }

  waitForInputResponse() {
    this.showConsoleInput()
    return new Promise((resolve) => {

    })
      // $("#console-input").keypress((e) => {
      //   if (e.which == 13) {
      //     this.hideConsoleInput()
      //     resolve($("#console-input").val())
      //   }
      // });
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
      let header = report.columnHeader || {}
      let dimensionHeaders = header.dimensions ? Object.assign({}, header.dimensions) : []
      let headers = ["Date Range", ...dimensionHeaders, "Sessions"]

      // let metricHeaders = (header.metricHeader && header.metricHeader.metricHeaderEntries) || []

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
      const subpy = window.require('child_process').spawn('python', [
        // dear god please this needs to be cleaned somehow
        path.join(window.__dirname, "../../../../../../../../public/analytics.py"),
        this.ids.view
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

  showConsoleInput() {
    // if ($("#console-input").css("display") === "none") {
    //   const inputHeight = $("#console-input").height();
    //   const originalConsoleHeight = $("#console").height();

    //   $("#console-input").show()
    //   $("#console").css("bottom", inputHeight)
    //   $("#console").height(originalConsoleHeight - inputHeight)
    //   $("#console-input").focus()
    // }
  }

  hideConsoleInput() {
    // if ($("#console-input").css("display") !== "none") {
    //   const inputHeight = $("#console-input").height();
    //   const prevConsoleHeight = $("#console").height()

    //   $("#console-input").hide()
    //   $("#console").css("bottom", "0")
    //   $("#console").height(prevConsoleHeight + inputHeight)
    // }
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
