const { process } = require('ipaddr.js')
const winston = require('winston')

function getLogger (params) {
  const format = winston.format.combine(
    winston.format((info, opts = {}) => {
      info.ts = Date.now() * 1000000 // timestamp with nanoseconds, doesn't have precision,
      info.group_id = params.testGroupId
      info.run_id = params.testRun
      return info
    })(),
    winston.format.json()
  )

  return winston.createLogger({
    level: process.env.LOG_LEVEL !== ''
      ? process.env.LOG_LEVEL
      : 'info',
    format,
    transports: [
      new winston.transports.Console({
        format
      })
    ]
  })
}

module.exports = {
  getLogger
}
