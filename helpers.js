const fs = require("fs")
const readline = require('readline')
const _ = require("lodash")

function readlineAsPromise(question) {
  return new Promise((resolve, reject) => {
    let $rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    $rl.question(`${question} `, (res) => {
      $rl.close()
      resolve(res)
    })
  })
}

function getMultipleResponses(questions, responses) {
  if (!responses) {
    responses = []
  }

  return readlineAsPromise(questions.shift())
    .then((res) => {
      responses.push(res)

      if (!questions.length) {
        return responses
      }

      return getMultipleResponses(questions, responses)
    })
}

/**
 * Store data to disk be used in later program executions.
 *
 * @param {Object} data The data to store to disk.
 */
function storeData(data, path, dir) {
  return new Promise((resolve, reject) => {
    if (dir) {
      try {
        fs.mkdirSync(dir)
      } catch (err) {
        if (err.code != 'EEXIST') {
          throw err
        }
      }
    }


    const writeable = JSON.stringify(data)

    fs.writeFile(path, writeable, (err) => {
      if (err) {
        console.log("Error saving data:", data)
        reject(err)
      }
      console.log('Data stored to ' + path)
      resolve()
    })
  })
}

function parseAnalyticsResponse(data) {
  const ret = { rows: []}

  data.reports.forEach((report) => {
    let header = report.columnHeader || {}
    let dimensionHeaders = _.cloneDeep(header.dimensions || [])
    let headers = ["Date Range", ...dimensionHeaders, "Sessions"]

    // let metricHeaders = (header.metricHeader && header.metricHeader.metricHeaderEntries) || []

    Object.assign(ret, { headers })

    report.data.rows.forEach((row) => {
      dimensions = row.dimensions || []
      dateRangeValues = row.metrics || []

      for (let i = 0; i < dateRangeValues.length; i++) {
        let values = dateRangeValues[i]
        ret.rows.push([i, ...dimensions, values.values[0]])
      }
    })
  })

  return ret
}

module.exports = {
  getMultipleResponses,
  parseAnalyticsResponse,
  readlineAsPromise,
  storeData
}
