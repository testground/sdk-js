
'use strict'

const { createMetric, metricTypes } = require('./utils')

/** @typedef {import('./types').EWMA} EWMA */

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
    // It assumes it is called every five seconds.
    tick: () => {
      if (init === 1) {
        updateRate(fetchInstantRate())
      } else {
        init = 1
        rate = fetchInstantRate()
      }
    },
    /**
     * @param {number} n
     */
    update: (n) => {
      uncounted += n
    }
  }

  return {
    ...ewma,
    toMetric: () => {
      return createMetric(name, metricTypes.ewma, {
        rate: ewma.rate()
      })
    }
  }
}

module.exports = {
  newEWMA
}
