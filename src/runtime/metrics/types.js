'use strict'

// https://github.com/testground/sdk-go/blob/d78f61eccaa37b0d941f98650bce5dbb8fd7b7f1/runtime/metrics_types.go#L26

/** @typedef {import('./types').Metric} Metric */
/** @typedef {import('./types').Point} Point */
/** @typedef {import('./types').Counter} Counter */
/** @typedef {import('./types').EWMA} EWMA */
/** @typedef {import('./types').Gauge} Gauge */
/** @typedef {import('./types').Histogram} Histogram */
/** @typedef {import('./types').Meter} Meter */
/** @typedef {import('./types').Timer} Timer */





/**
 * @param {string} name
 * @param {boolean} resetting
 * @returns {Histogram}
 */
function newHistogram (name, resetting) {
  return {
    toMetric: () => {
      const metric = createMetric(name, metricHistogram, {})
      // TODO
      return metric
    }
  }
}

/**
 * @param {string} name
 * @returns {Meter}
 */
function newMeter (name) {
  return {
    toMetric: () => {
      const metric = createMetric(name, metricMeter, {})
      // TODO
      return metric
    }
  }
}

/**
 * @param {string} name
 * @returns {Timer}
 */
function newTimer (name) {
  return {
    toMetric: () => {
      const metric = createMetric(name, metricTimer, {})
      // TODO
      return metric
    }
  }
}

module.exports = {
  newPoint,
  newCounter,
  newStandardGauge,
  newFunctionalGauge,
  newEWMA,
  newHistogram,
  newMeter,
  newTimer
}
