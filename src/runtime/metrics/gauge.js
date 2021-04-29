
'use strict'

const { createMetric, metricTypes } = require('./utils')

/** @typedef {import('./types').Gauge} Gauge */

/**
 * @param {string} name
 * @param {Function} func
 * @returns {Gauge}
 */
function newFunctionalGauge (name, func) {
  return {
    update: (n) => {
      throw new Error('cannot update functional gauge')
    },
    value: () => {
      return func()
    },
    toMetric: () => {
      return createMetric(name, metricTypes.gauge, { value: func() })
    }
  }
}

/**
 * @param {string} name
 * @returns {Gauge}
 */
function newStandardGauge (name) {
  let value = 0

  return {
    update: (n) => {
      value = n
    },
    value: () => {
      return value
    },
    toMetric: () => {
      return createMetric(name, metricTypes.gauge, { value })
    }
  }
}

module.exports = {
  newFunctionalGauge,
  newStandardGauge
}
