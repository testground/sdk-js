'use strict'

/**
 * Gets the environment that can be used by the environment
 * to create the runtime.
 *
 * @returns {Record<string, string|undefined>}
 */
function getCurrentEnv () {
  return process.env
}

module.exports = {
  getCurrentEnv
}
