'use strict'

const { newPoint, newCounter, newEWMA, newMeter, newTimer } = require('./metrics_types')

/** @typedef {import('./types').Events} Events */
/** @typedef {import('./types').RunParams} RunParams */
/** @typedef {import('./types').SignalEmitter} SignalEmitter */
/** @typedef {import('./types').RunEnv} RunEnv */
/** @typedef {import('winston').Logger} Logger */
/** @typedef {import('./types').Metric} Metric */
/** @typedef {import('./types').Metrics} Metrics */
/** @typedef {import('./types').MetricsApi} MetricsApi */

/**
 * @param {RunParams} runParams
 * @param {Logger} logger
 * @param {Events} events
 * @param {function():SignalEmitter|null} getSignalEmitter
 * @returns {Metrics}
 */
function newMetrics (runParams, logger, events, getSignalEmitter) {
  return {
    d: makeMetrics([], events),
    r: makeMetrics([], events),
    close: () => {
      // TODO: probably not needed
    }
  }
}

/**
 * @param {Array<function(Metric):void>} sinks
 * @param {Events} events
 * @returns {MetricsApi}
 */
function makeMetrics (sinks, events) {
  /**
   * @param {Metric} metric
   */
  const broadcast = async (metric) => {
    for (const sink of sinks) {
      try {
        sink(metric)
      } catch (error) {
        events.recordMessage(`failed to emit metric: ${error.toString()}`)
      }
    }
  }

  return {
    recordPoint: (name, value) => {
      const point = newPoint(name, value).toMetric()
      broadcast(point)
    },
    counter: (name) => {
      const counter = newCounter(name)
      // TODO
      return counter
    },
    ewma: (name, alpha) => {
      const ewma = newEWMA(name, alpha)
      // TODO
      return ewma
    },
    // gauge: name => {
    //   // TODO: return type Gauge
    // },
    // histogram: (name, sample) => {
    //   // TODO: return type Histogram
    // },
    meter: (name) => {
      const meter = newMeter(name)
      // TODO
      return meter
    },
    // resettingHistogram: (name) => {
    //   // TODO: return type Histogram
    // },
    // setFrequency: (freq) => {
    //   // TODO
    // },
    timer: (name) => {
      const timer = newTimer(name)
      // TODO
      return timer
    }
    // close: () => {
    //   // TODO: probably not needed
    // }
  }
}

module.exports = {
  newMetrics
}
