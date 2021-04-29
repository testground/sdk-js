
'use strict'

const { createMetric, metricTypes } = require('./utils')

/** @typedef {import('./types').Timer} Timer */
/**
 * @param {string} name
 * @returns {Timer}
 */
function newTimer (name) {
  return {
    toMetric: () => {
      const metric = createMetric(name, metricTypes.timer, {})
      // TODO
      return metric
    }
  }
}

module.exports = {
  newTimer
}
