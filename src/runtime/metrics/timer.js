
'use strict'

const { newHistogram } = require('./histogram')
const { newMeter } = require('./meter')
const { newExpDecaySample } = require('./sample')
const { createMetric, metricTypes } = require('./utils')

/** @typedef {import('./types').Timer} Timer */

/**
 * @param {string} name
 * @returns {Timer}
 */
function newTimer (name) {
  const meter = newMeter(`${name}-meter`)
  const histogram = newHistogram(`${name}-histogram`, newExpDecaySample(1028, 0.015))

  const timer = /** @type {Timer} */({
    count: () => histogram.count(),
    max: () => histogram.max(),
    mean: () => histogram.mean(),
    min: () => histogram.min(),
    percentile: (n) => histogram.percentile(n),
    percentiles: (n) => histogram.percentiles(n),
    rate1: () => meter.rate1(),
    rate5: () => meter.rate5(),
    rate15: () => meter.rate15(),
    rateMean: () => meter.rateMean(),
    stdDev: () => histogram.stdDev(),
    stop: () => meter.stop(),
    sum: () => histogram.sum(),
    time: (func) => {
      const start = new Date()
      func()
      timer.updateSince(start)
    },
    update: (dur) => {
      histogram.update(dur)
      meter.mark(1)
    },
    updateSince: (date) => {
      const ns = (new Date().getTime() - date.getTime()) * 1e6
      histogram.update(ns)
      meter.mark(1)
    },
    variance: () => histogram.variance(),
    toMetric: () => {
      const p = histogram.percentiles([0.5, 0.75, 0.95, 0.99, 0.999, 0.9999])

      return createMetric(name, metricTypes.timer, {
        count: timer.count(),
        max: timer.count(),
        mean: timer.mean(),
        min: timer.min(),
        stddev: timer.stdDev(),
        variance: timer.variance(),
        p50: p[0],
        p75: p[1],
        p95: p[2],
        p99: p[3],
        p999: p[4],
        p9999: p[5],
        m1: timer.rate1(),
        m5: timer.rate5(),
        m15: timer.rate15(),
        meanrate: timer.rateMean()
      })
    }
  })

  return timer
}

module.exports = {
  newTimer
}
