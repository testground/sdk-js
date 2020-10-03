const winston = require('winston')

const { newEvents } = require('./events')
const { parseRunParams } = require('./params')

function currentRunEnv () {
  return parseRunEnv(process.env)
}

function parseRunEnv (env) {
  const p = parseRunParams(env)
  return newRunEnv(p)
}

function newRunEnv (params) {
  const format = winston.format.combine(
    winston.format((info, opts = {}) => {
      info.ts = Date.now() * 1000000 // timestamp with nanoseconds, doesn't have precision,
      info.group_id = params.testGroupId
      info.run_id = params.testRun
      return info
    })(),
    winston.format.json()
  )

  const options = {
    runParams: params,
    logger: winston.createLogger({
      level: 'debug',
      format,
      transports: [
        new winston.transports.Console({
          format
        })
      ]
    })
  }

  return {
    ...params,
    ...options,
    ...newEvents(options)
  }
}

module.exports = {
  newRunEnv,
  currentRunEnv,
  parseRunEnv
}
