
'use strict'

const { newEWMA } = require('./ewma')
const { createMetric, metricTypes } = require('./utils')

/** @typedef {import('./types').Meter} Meter */

// TODO: does this needs some sort of locking mechanism?
const tickers = /** @type {Record<string, function():void>} */({})

setInterval(() => {
  // Tick meters every 5 seconds.
  for (const ticker of Object.values(tickers)) {
    ticker()
  }
}, 5000)

/**
 * @param {string} name
 * @returns {Meter}
 */
function newMeter (name) {
  const start = new Date().getTime()
  const a1 = newEWMA('a1', Math.exp(-5.0 / 60 / 1))
  const a5 = newEWMA('a5', Math.exp(-5.0 / 60 / 5))
  const a15 = newEWMA('a15', Math.exp(-5.0 / 60 / 15))

  let r1 = 0
  let r5 = 0
  let r15 = 0
  let rMean = 0
  let count = 0
  let stopped = false

  const meter = /** @type {Meter} */({
    count: () => count,
    rate1: () => r1,
    rate5: () => r5,
    rate15: () => r15,
    rateMean: () => rMean,
    mark: (n) => {
      if (stopped) {
        return
      }

      count += n
      a1.update(n)
      a5.update(n)
      a15.update(n)
      update()
    },
    stop: () => {
      stopped = true
      delete tickers[name]
    },
    toMetric: () => {
      return createMetric(name, metricTypes.meter, {
        count: meter.count(),
        m1: meter.rate1(),
        m5: meter.rate5(),
        m15: meter.rate15(),
        mean: meter.rateMean()
      })
    }
  })

  const update = () => {
    r1 = a1.rate()
    r5 = a5.rate()
    r15 = a15.rate()
    const secondsSince = (new Date().getTime() - start) / 1000
    rMean = meter.count() / secondsSince
  }

  const ticker = () => {
    a1.tick()
    a5.tick()
    a15.tick()
    update()
  }

  tickers[name] = ticker
  return meter
}

module.exports = {
  newMeter
}
