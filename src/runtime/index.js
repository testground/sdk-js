'use strict'

const { getLogger } = require('./logger')
const { newEvents } = require('./events')
const { newMetrics } = require('./metrics')
const { parseRunParams } = require('./params')

/** @typedef {import('./types').RunParams} RunParams */
/** @typedef {import('./types').SignalEmitter} SignalEmitter */
/** @typedef {import('./types').RunEnv} RunEnv */

/**
 * Creates a runtime environment from the environment variables.
 *
 * @returns {RunEnv}
 */
function currentRunEnv () {
  return parseRunEnv(process.env)
}

/**
 * Creates a runtime environment from the provided list of variables.
 *
 * @param {Record<string, string|undefined>} env
 */
function parseRunEnv (env) {
  const p = parseRunParams(env)
  return newRunEnv(p)
}

/**
 * Creates a runtime environment from the given runtime parameters.
 *
 * @param {RunParams} params
 * @returns {RunEnv}
 */
function newRunEnv (params) {
  let signalEmitter = /** @type {SignalEmitter|null} */(null)

  const getSignalEmitter = () => signalEmitter
  const logger = getLogger(params)
  const events = newEvents(params, logger, getSignalEmitter)
  const metrics = newMetrics(params, logger, events, getSignalEmitter)

  return {
    ...params,
    ...events,
    ...metrics,
    logger: logger,
    runParams: params,
    getSignalEmitter: getSignalEmitter,
    setSignalEmitter: (e) => { signalEmitter = e }
  }
}

module.exports = {
  newRunEnv,
  currentRunEnv,
  parseRunEnv
}
