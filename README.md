# Google Analytics 2 Sheets

This desktop app was built to make it easier for you to view and analyze your Google Analytics data over time. After generating a few authorization keys in your Google APIs console, you'll be ready to fetch any data you want and send it to whichever Sheet you'd like!

## Getting started

v1.0.0:

1. Go to your Terminal and copy-paste `git clone git@github.com:drigberg/GoogleAnalyticsToSheets.git`. (after each command, hit `enter`)
2. `cd GoogleAnalyticsToSheets` - this moves you into the project folder
3. `npm i` - this installs all dependencies

(Get client secret and save in `keys` folder as client_key.json)
(Get analytics secret file and save in `keys` folder as analytics_key.json)

4. `npm start` - this starts the application. You will be navigated to the app.

Then, select any metrics and dimensions you'd like to fetch. Follow any directions provided regarding spreadsheet ID, spreadsheet range, view id, authorization, etc.

## Helpful Links

- Google analytics metrics and dimensions: https://developers.google.com/analytics/devguides/reporting/core/dimsmets#cats=user