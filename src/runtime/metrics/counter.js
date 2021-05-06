
'use strict'

const { createMetric, metricTypes } = require('./utils')

/** @typedef {import('./types').Counter} Counter */

/**
 * @param {string} name
 * @returns {Counter}
 */
function newCounter (name) {
  let count = 0

  return {
    clear: () => {
      count = 0
    },
    count: () => {
      return count
    },
    dec: (i) => {
      count -= i
    },
    inc: (i) => {
      count += i
    },
    toMetric: () => {
      const metric = createMetric(name, metricTypes.counter, { count })
      count = 0
      return metric
    }
  }
}

module.exports = {
  newCounter
}
