/**
* Module dependencies
*/

const fs = window.require('fs')
const google = require('googleapis')
const googleAuth = require('google-auth-library')
const path = require("path");
const { spawn } = require("child_process");

/**
* Module variables
*/

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
const ENV_PATH = "./.env.json"
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE) + '/.credentials/'
const TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json'
const CLIENT_SECRET_PATH = path.join(__dirname, '../../sheets_key.json')
let viewId
let spreadsheetId
/**
* Module
*/

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {Function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, callbackData) {
  writeToConsole("Getting authorization from Sheets API...")

  const clientSecret = credentials.installed.client_secret
  const clientId = credentials.installed.client_id
  const redirectUrl = credentials.installed.redirect_uris[0]
  const auth = new googleAuth()
  const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl)

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      return getNewToken(oauth2Client, callback)
    }

    oauth2Client.credentials = JSON.parse(token)
    return callback(oauth2Client)
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
function getNewToken(oauth2Client, callback) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })

  writeToConsole(`Authorize this app by visiting this url: ${authUrl}. \nEnter that code here in the input bar below and then hit enter.`)
  return waitForInputResponse()
    .then(
    })
}

/**
 * Get and store env data if in json file -- if not, query user and
 * write to file
 *
 */
function fetchEnv() {
  writeToConsole("Checking for spreadsheet id...")
  return new Promise((resolve, reject) => {
    fs.readFile(ENV_PATH, (err, data) => {
      let promise = Promise.resolve()

      if (err || !data) {
        const questions = [
          'What is the id of your Google Sheet?',
          'What is your view id?'
        ]

        promise = multipleDialogs(questions)
          .then((res) => {
            data = {
              "spreadsheetId": res[0],
              "viewId": res[1]
            }

            storeData(JSON.stringify(data), ENV_PATH)
          })
      }

      promise
        .then(() => {
          let keyString = Buffer.isBuffer(data) ? JSON.parse(data) : data
          const parsed = JSON.parse(keyString)

          viewId = parsed.viewId
          spreadsheetId = parsed.spreadsheetId

          resolve()
        })
    })
  })
}

function writeToSheet(data) {
  return (authClient) => {
    writeToConsole("\nSending data to Sheets API...")
    const body = {
      values: [data.headers, ...data.rows]
    }

    const sheets = google.sheets('v4')

    sheets.spreadsheets.values.append({
      auth: authClient,
      spreadsheetId,
      range: "AllData!A1:Z",
      valueInputOption: "RAW",
      resource: body
    }, (err, res) => {
      if (err) {
        writeToConsole("Write error:", err)
      } else {
        writeToConsole(`${res.updates.updatedCells} cells updated in range ${res.updates.updatedRange}.\n`)
      }
    })
  }
}



function fetchAndSend() {
  writeToConsole("\n")
  fetchEnv()
    .then(() => {
      return getAnalyticsData()
    })
    .catch((err) => {
      writeToConsole("Analytics error:", err)
    })
    .then((data) => {
      if (!data) {
        writeToConsole("Error: no data received")
        process.exit(0)
      }

      const parsedData = parseAnalyticsResponse(data)
      writeToConsole("Got analytics data!")
      writeToConsole("\nReading sheets client file...")
      fs.readFile(CLIENT_SECRET_PATH, (err, content) => {
        if (err) {
          writeToConsole('Error loading client secret file: ' + err)
          return
        }

        // Authorize a client with the loaded credentials, then call the
        // Google Sheets API.
        const writer = writeToSheet(parsedData)
        const parsedSecret = JSON.parse(content)
        authorize(parsedSecret, writer)
      })
    })
    .catch((err) => {
      writeToConsole("Error:", err)
    })
}

