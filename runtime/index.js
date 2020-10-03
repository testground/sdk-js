const { getLogger } = require('./logger')
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
    logger: getLogger(params)
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
