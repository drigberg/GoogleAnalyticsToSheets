const fs = require("fs")
const readline = require('readline')
const _ = require("lodash")
const dialogs = require('dialogs')()

function writeToConsole(text) {
  let existingText = $("#console").text()
  let newText = "\n" + text
  $("#console").text(existingText + newText)
  $('#console').scrollTop($('#console')[0].scrollHeight);
}

function dialogAsPromise(question) {
  return new Promise((resolve, reject) => {
    dialogs.prompt(question, (res) => {
      resolve(res)
    })
  })
}

function showConsoleInput() {
  if ($("#console-input").css("display") === "none") {
    const inputHeight = $("#console-input").height();
    const originalConsoleHeight = $("#console").height();

    $("#console-input").show()
    $("#console").css("bottom", inputHeight)
    $("#console").height(originalConsoleHeight - inputHeight)
    $("#console-input").focus()
  }
}

function hideConsoleInput() {
  if ($("#console-input").css("display") !== "none") {
    const inputHeight = $("#console-input").height();
    const prevConsoleHeight = $("#console").height()

    $("#console-input").hide()
    $("#console").css("bottom", "0")
    $("#console").height(prevConsoleHeight + inputHeight)
  }
}

function multipleDialogs(questions, responses) {
  if (!responses) {
    responses = []
  }

  return dialogAsPromise(questions.shift())
    .then((res) => {
      responses.push(res)

      if (!questions.length) {
        return responses
      }

      return multipleDialogs(questions, responses)
    })
}

function waitForInputResponse() {
  showConsoleInput()
  return new Promise((resolve) => {
    $("#console-input").keypress((e) => {
      if (e.which == 13) {
        hideConsoleInput()
        resolve($("#console-input").val())
      }
    });
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
        writeToConsole("Error saving data:", data)
        reject(err)
      }
      writeToConsole('Data stored to ' + path)
      resolve()
    })
  })
}

function parseAnalyticsResponse(data) {
  const ret = { rows: [] }

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
