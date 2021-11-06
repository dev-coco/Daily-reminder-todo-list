const now = new Date()
const year = now.getFullYear()
const month = now.getMonth() + 1
const day = now.getDate()

function sheetData () {
  const response = UrlFetchApp.fetch('https://sheets.googleapis.com/v4/spreadsheets/sheetID/values/sheetName!A5:C?key=API')
  const json = response.getContentText()
  const data = JSON.parse(json)
  return data
}

// 发送信息
function sendMessenger (str) {
  UrlFetchApp.fetch('https://api.telegram.org/botToken/sendMessage?chat_id=userID&text=' + encodeURIComponent(str))
}

// 代办事项
function todaySchedule () {
  let str = []
  let index = []
  for (const list of sheetData().values) {
    const date = list[1]
    const content = list[2]
    if (month + '/' + day === date) {
      index++
      str += `${index}. ${content}\n`
    }
  }
  sendMessenger(`📅${year}/${month}/${day}  ☀️代办事项\n\n${str}`)
}

// 未完成事项
function unfinishedSchedule () {
  let str = []
  let index = []
  for (const list of sheetData().values) {
    const status = list[0]
    const date = list[1]
    const content = list[2]
    if (month + '/' + day === date) {
      if (status === 'FALSE') {
        index++
        str += `${index}. ${content}\n`
      }
    }
  }
  sendMessenger(`📅${year}/${month}/${day}  🌙未完成事项\n\n${str}`)
}
