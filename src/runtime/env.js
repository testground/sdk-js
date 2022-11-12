'use strict'

/**
 * Gets the environment that can be used by the environment
 * to create the runtime.
 *
 * @returns {Record<string, string|undefined>}
 */
function getProcessEnv () {
  return process.env
}

module.exports = {
  getProcessEnv
}
