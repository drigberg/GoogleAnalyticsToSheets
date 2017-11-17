// Client ID and API key from the Developer Console
let CLIENT_ID = '564478280391-lecf9d328i7leegs84sdi2c8s2jo26o0.apps.googleusercontent.com';
let API_KEY = 'AIzaSyCYZxcJjQGu88aYdYXwJNTGya32i7hGcLw';

// Array of API discovery doc URLs for APIs used by the quickstart
let DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
let SCOPES = "https://www.googleapis.com/auth/spreadsheets";

let authorizeButton = document.getElementById('authorize-button');
let signoutButton = document.getElementById('signout-button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  console.log("UPDATE!")
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    // listMajors();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function writeToSheets(data) {
  const body = {
    values: [data.headers, ...data.rows]
  }

  console.log("Writing!!!!", body)
  gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: "1UUwi_sXjA1GVtZar51tQ12XMEB7OAlFFPZ00vM-uNjg",
    range: "AllData!A1:Z",
    valueInputOption: "RAW",
    resource: body
  })
  .then((res) => {
    document.getElementById('query-output').value =
    `${res.result.updates.updatedCells} cells updated in range ${res.result.updates.updatedRange}.\n`
  })
  .catch((err) => {
    document.getElementById('query-output').value = err.message
  })
}