
const VIEW_ID = '163977396'

function getMetrics() {
  let metrics = Array.from($(".metrics"))
  let checkedMetrics = []

  metrics.forEach(function (checkBox) {
    if (checkBox.checked) {
      let checkBoxId = { expression: `ga:${checkBox.id}` }
      checkedMetrics.push(checkBoxId)
    }
  })
  return checkedMetrics
}

function getDimensions() {
  let dimensions = Array.from($(".dimensions"))
  let checkedDimensions = []

  dimensions.forEach(function (checkBox) {
    if (checkBox.checked) {
      let checkBoxId = { name: `ga:${checkBox.id}` }
      checkedDimensions.push(checkBoxId)
    }
  })
  return checkedDimensions
}

function queryReports() {
  console.log($("#screenResolution").prop('checked'))
  const metrics = getMetrics()
  const dimensions = getDimensions()

  console.log(metrics, dimensions)

  gapi.client.request({
    path: '/v4/reports:batchGet',
    root: 'https://analyticsreporting.googleapis.com/',
    method: 'POST',
    body: {
      reportRequests: [
        {
          viewId: VIEW_ID,
          dateRanges: [
            {
              startDate: '7daysAgo',
              endDate: 'today'
            }
          ],
          metrics: metrics,
          dimensions: dimensions
        }
      ]
    }
  }).then(sendToSheets, console.error.bind(console));
}

function sendToSheets(response) {
  console.log(response.result)

  const parsed = parseAnalyticsResponse(response.result)

  const formattedJson = JSON.stringify(parsed, null, 2);
  document.getElementById('query-output').value = formattedJson;

  writeToSheets(parsed)
}

function parseAnalyticsResponse(data) {
  console.log(data)
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
