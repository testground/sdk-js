
'use strict'

const { createMetric, metricTypes } = require('./utils')

/** @typedef {import('./types').Point} Point */

/**
 * @param {string} name
 * @param {number} value
 * @returns {Point}
 */
function newPoint (name, value) {
  return {
    value: () => {
      return value
    },
    toMetric: () => {
      return createMetric(name, metricTypes.point, { value })
    }
  }
}

module.exports = {
  newPoint
}
