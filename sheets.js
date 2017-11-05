/**
* Module dependencies
*/

const fs = require('fs')
const readline = require('readline')
const google = require('googleapis')
const googleAuth = require('google-auth-library')
const { 
    getMultipleResponses,
    parseAnalyticsResponse,       
    readlineAsPromise, 
    storeData 
} = require('./helpers')
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
const CLIENT_SECRET_PATH = 'sheets_key.json'
let view_id
let spreadsheet_id
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
    console.log("Getting authorization from Sheets API...")
    return new Promise((resolve, reject) => {
        const clientSecret = credentials.installed.client_secret
        const clientId = credentials.installed.client_id
        const redirectUrl = credentials.installed.redirect_uris[0]
        const auth = new googleAuth()
        const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl)

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, (err, token) => {
          if (err) {
            getNewToken(oauth2Client, callback)
          } else {
            oauth2Client.credentials = JSON.parse(token)
            callback(oauth2Client, callbackData)
          }
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
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  })

  console.log(`Authorize this app by visiting this url: ${authUrl}`)

  let question = 'Enter the code from that page here:'

  readlineAsPromise(question)
  .then((code) => {
      oauth2Client.getToken(code, (err, token) => {
        if (err) {
          console.log('Error while trying to retrieve access token', err)
          return
        }
        oauth2Client.credentials = token
        storeData(token, TOKEN_PATH, TOKEN_DIR)
        callback(oauth2Client)
      })
  })
}

/**
 * Get and store env data if in json file -- if not, query user and
 * write to file
 *
 */
function fetchEnv() {
    console.log("Checking for spreadsheet id...")
    return new Promise((resolve, reject) => {
        fs.readFile(ENV_PATH, (err, data) => {
            let promise = Promise.resolve()

            if (err || !data) {
                const questions = [
                    'What is the id of your google sheet?',
                    'What is your view id?'
                ]

                promise = getMultipleResponses(questions)
                .then((res) => {
                    data = { 
                        "spreadsheetId": res[0],
                        "viewId": res[1]
                    }

                    storeData(JSON.stringify(data), ENV_PATH)
                })
            }

            return promise
            .then(() => {
                let parsed = Buffer.isBuffer(data) ? JSON.parse(data) : data
                console.log(parsed)
                view_id = parsed.viewId
                spreadsheet_id = parsed.spreadsheetId

                resolve()
            })
        })
    })
}

function writeToSheet(authClient, data) {
    console.log("\nSending data to Sheets API...")
    const body = {
        values: [data.headers, ...data.rows]
    }

    const sheets = google.sheets('v4')

    sheets.spreadsheets.values.append({
        auth: authClient,
        spreadsheetId: spreadsheet_id,
        range: "AllData!A1:Z",
        valueInputOption: "RAW",
        resource: body
    }, (err, res) => {
        if (err) {
        console.log("Write error:", err)
        } else {
        console.log(`${res.updates.updatedCells} cells updated in range ${res.updates.updatedRange}.\n`)
        }
    })
}

/**
* Module execution
*/

function getAnalyticsData() {
    let parsed
    return new Promise((resolve, reject) => {
        console.log("Getting analytics data...")
        const { spawn } = require("child_process");
        const process = spawn('python', ["./analytics.py", view_id]);

        process.stdout.on('data', (chunk) => {
            let readable = chunk.toString().replace(/u'/g, "'").replace(/'/g, "\"")
            parsed = JSON.parse(readable); // buffer to object
        });

        process.stdout.on('end', () => {
            resolve(parsed)
        })

        process.stdout.on('error', (err) => {
            reject(err)
        });
    })
}

// Load client secrets from a local file.

function main() {
    console.log("\n")
    fetchEnv()
    .then(() => {
        return getAnalyticsData()
    })    
    .catch((err) => {
        console.log("Analytics error:", err)
    })
    .then((data) => {
        const parsedData = parseAnalyticsResponse(data)
        console.log("Got analytics data!")
        console.log("\nReading sheets client file...")
        fs.readFile(CLIENT_SECRET_PATH, (err, content) => {
            if (err) {
                console.log('Error loading client secret file: ' + err)
                return
            }

            // Authorize a client with the loaded credentials, then call the
            // Google Sheets API.
            authorize(JSON.parse(content), writeToSheet, parsedData)
        })
    })
    .catch((err) => {
        console.log("Error:", err)
    })
}

main()
