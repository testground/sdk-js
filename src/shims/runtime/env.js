'use strict'

/**
 * Gets the environment that can be used by the environment
 * to create the runtime.
 *
 * @returns {Record<string, string|undefined>}
 */
function getCurrentEnv () {
  // @ts-ignore
  return window.testground.env
}

module.exports = {
  getCurrentEnv
}
