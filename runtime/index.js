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
  const options = {
    runParams: params,
    logger: winston.createLogger({
      level: 'debug',
      format: winston.format.json(),
      transports: [
        new winston.transports.Console({
          format: winston.format.simple()
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
