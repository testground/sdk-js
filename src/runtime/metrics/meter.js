
'use strict'

const { createMetric, metricTypes } = require('./utils')

/** @typedef {import('./types').Meter} Meter */

/**
 * @param {string} name
 * @returns {Meter}
 */
function newMeter (name) {
  return {
    toMetric: () => {
      const metric = createMetric(name, metricTypes.meter, {})
      // TODO
      return metric
    }
  }
}

module.exports = {
  newMeter
}
