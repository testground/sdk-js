'use strict'

/** @typedef {import('./types').Metric} Metric */

const metricTypes = {
  point: 0,
  counter: 1,
  ewma: 2,
  gauge: 3,
  histogram: 4,
  meter: 5,
  timer: 6
}

/**
 *
 * @param {string} name
 * @param {number} type
 * @param {Record<string, any>} measures
 * @returns {Metric}
 */
function createMetric (name, type, measures) {
  return {
    ts: new Date().getTime() * 1e6,
    name,
    type,
    measures
  }
}

module.exports = {
  metricTypes,
  createMetric
}
