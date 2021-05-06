
'use strict'

const { createMetric, metricTypes } = require('./utils')

/** @typedef {import('./types').Histogram} Histogram */
/** @typedef {import('./types').Sample} Sample */
/** @typedef {import('./types').Metric} Metric */

/**
 * @param {string} name
 * @param {Sample} sample
 * @returns {Metric}
 */
function createHistogramMetric (name, sample) {
  const p = sample.percentiles([0.5, 0.75, 0.95, 0.99, 0.999, 0.9999])

  return createMetric(name, metricTypes.histogram, {
    count: sample.count(),
    max: sample.count(),
    mean: sample.mean(),
    min: sample.min(),
    stddev: sample.stdDev(),
    variance: sample.variance(),
    p50: p[0],
    p75: p[1],
    p95: p[2],
    p99: p[3],
    p999: p[4],
    p9999: p[5]
  })
}

/**
 * @param {string} name
 * @param {Sample} sample
 * @returns {Histogram}
 */
function newHistogram (name, sample) {
  return {
    ...sample,
    sample: () => {
      return sample
    },
    toMetric: () => {
      return createHistogramMetric(name, sample)
    }
  }
}

/**
 * @param {string} name
 * @returns {Histogram}
 */
function newResettingHistogram (name) {
  // TODO: implement
  return {
    toMetric: () => {
      const metric = createMetric(name, metricTypes.histogram, {})
      // TODO
      return metric
    }
  }
}

module.exports = {
  newHistogram,
  newResettingHistogram
}
