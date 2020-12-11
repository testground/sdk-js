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
  let signalEmitter = null

  const options = {
    runParams: params,
    logger: getLogger(params),
    getSignalEmitter: () => signalEmitter
  }

  return {
    ...params,
    ...options,
    ...newEvents(options),
    setSignalEmitter: (e) => { signalEmitter = e }
  }
}

module.exports = {
  newRunEnv,
  currentRunEnv,
  parseRunEnv
}
