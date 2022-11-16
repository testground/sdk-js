/* eslint-disable no-console */
'use strict'

// Loosely based on Winston's Logger logic,
// simplified for our minimal needs.
// See license at https://github.com/winstonjs/winston/blob/master/LICENSE
// for original source code.

function getLogger () {
  return {
    /**
     * @param {any[]} args
     */
    debug (...args) {
      return this.log(console.debug, ...args)
    },

    /**
     * @param {any[]} args
     */
    info (...args) {
      return this.log(console.info, ...args)
    },

    /**
     * @param {any[]} args
     */
    warn (...args) {
      return this.log(console.warn, ...args)
    },

    /**
     * @param {any[]} args
     */
    error (...args) {
      return this.log(console.error, ...args)
    },

    /**
     * @param {CallableFunction} fn
     * @param {any[]} args
     */
    log (fn, ...args) {
      fn(JSON.stringify(args))
    }
  }
}

module.exports = {
  getLogger
}
