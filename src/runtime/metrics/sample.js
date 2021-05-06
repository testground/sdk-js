'use strict'

/** @typedef {import('./types').Sample} Sample */

/**
 *
 * @param {number} reservoirSize
 * @param {number} alpha
 * @returns {Sample}
 */
function newExpDecaySample (reservoirSize, alpha) {
  return {}
}

/**
 *
 * @param {number} reservoirSize
 * @returns {Sample}
 */
function newUniformSample (reservoirSize) {
  let count = 0
  let values = /** @type number[] */([])

  return {
    clear: () => {
      count = 0
      values = []
    },
    count: () => count,
    max: () => Math.max(...values),
    min: () => Math.min(...values),
    mean: () => sampleMean(values),
    size: () => values.length,
    sum: () => sampleSum(values),
    stdDev: () => sampleStdDev(values),
    values: () => [...values],
    variance: () => sampleVariance(values),
    percentile: (p) => samplePercentile(values, p),
    percentiles: (ps) => samplePercentiles(values, ps),
    update: (v) => {
      count++
      if (values.length < reservoirSize) {
        values.push(v)
      } else {
        const r = Math.floor(Math.random() * count)
        if (r < values.length) {
          values[r] = v
        }
      }
    }
  }
}

module.exports = {
  newUniformSample,
  newExpDecaySample
}

/**
 *
 * @param {number[]} values
 * @returns number
 */
function sampleSum (values) {
  return values.reduce((a, b) => a + b, 0)
}

/**
 *
 * @param {number[]} values
 * @returns number
 */
function sampleMean (values) {
  return sampleSum(values) / values.length
}

/**
 *
 * @param {number[]} values
 * @returns number
 */
function sampleVariance (values) {
  if (values.length === 0) {
    return 0
  }

  const mean = sampleMean(values)
  let sum = 0

  for (const v of values) {
    const d = v - mean
    sum += d * d
  }

  return sum / values.length
}

/**
 *
 * @param {number[]} values
 * @returns number
 */
function sampleStdDev (values) {
  return Math.sqrt(sampleVariance(values))
}

/**
 *
 * @param {number[]} values
 * @param {number[]} ps
 * @returns number[]
 */
function samplePercentiles (values, ps) {
  const scores = new Array(ps.length).fill(0)
  const size = values.length
  if (size > 0) {
    values = [...values].sort() // Do not change original!
    for (const [i, p] of scores.entries()) {
      const pos = p * (size - 1)
      if (pos < 1.0) {
        scores[i] = values[0]
      } else if (pos >= size) {
        scores[i] = values[size - 1]
      } else {
        const lower = values[Math.round(pos) - 1]
        const upper = values[Math.round(pos)]
        scores[i] = lower + (pos - Math.floor(pos)) * (upper - lower)
      }
    }
  }
  return scores
}

/**
 *
 * @param {number[]} values
 * @param {number} p
 * @returns number
 */
function samplePercentile (values, p) {
  return samplePercentiles(values, [p])[0]
}
