
'use strict'

const { createMetric, metricTypes } = require('./utils')

/** @typedef {import('./types').Histogram} Histogram */

/**
 * @param {string} name
 * @param {boolean} resetting
 * @returns {Histogram}
 */
function newHistogram (name, resetting) {
  return {
    toMetric: () => {
      const metric = createMetric(name, metricTypes.histogram, {})
      // TODO
      return metric
    }
  }
}

module.exports = {
  newHistogram
}
