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
 * @param {number} alpha
 * @returns {EWMA}
 */
function newEWMA (name, alpha) {
  let uncounted = 0
  let rate = 0
  let init = 0

  /**
   * @returns {number}
   */
  const fetchInstantRate = () => {
    const count = uncounted
    uncounted = 0
    return count / 5e9
  }

  /**
   * @param {number} instantRate
   */
  const updateRate = (instantRate) => {
    rate += alpha * (instantRate - rate)
  }

  const ewma = {
    rate: () => {
      return rate * 1e9
    },
    // Tick ticks the clock to update the moving average.  It assumes it is called
    // every five seconds.
    // TODO: check how to not need to call it every 5 secs.
    tick: () => {
      if (init === 1) {
        updateRate(fetchInstantRate())
      } else {
        init = 1
        rate = fetchInstantRate()
      }
    },
    /**
     * @param {number} i
     */
    update: (i) => {
      uncounted += i
    }
  }

  return {
    ...ewma,
    toMetric: () => {
      return createMetric(name, metricEWMA, {
        rate: ewma.rate()
      })
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
