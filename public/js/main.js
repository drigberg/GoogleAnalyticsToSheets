
$("#fetch-and-send").click(() => {
  fetchAndSend()
})

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

