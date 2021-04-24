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

const metricPoint = 0
const metricCounter = 1
const metricEWMA = 2
const metricGauge = 3
const metricHistogram = 4
const metricMeter = 5
const metricTimer = 6

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
      return createMetric(name, metricPoint, { value })
    }
  }
}

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
      const metric = createMetric(name, metricCounter, { count })
      count = 0
      return metric
    }
  }
}

/**
 * @param {string} name
 * @returns {EWMA}
 */
function newEWMA (name) {
  return {
    toMetric: () => {
      const metric = createMetric(name, metricEWMA, {})
      // TODO
      return metric
    }
  }
}

/**
 * @param {string} name
 * @param {Function | null} func
 * @returns {Gauge}
 */
function newGauge (name, func) {
  return {
    toMetric: () => {
      const metric = createMetric(name, metricGauge, {})
      // TODO
      return metric
    }
  }
}

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
  newGauge,
  newEWMA,
  newHistogram,
  newMeter,
  newTimer
}
