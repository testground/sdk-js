'use strict'

/** @typedef {import('./types').Sample} Sample */
/** @typedef {import('./types').expDecaySample} expDecaySample */

/**
 *
 * @param {number} reservoirSize
 * @param {number} alpha
 * @returns {Sample}
 */
function newExpDecaySample (reservoirSize, alpha) {
  // TODO: implement; use newExpDecaySampleHeap
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

/**
 *
 * @param {number} reservoirSize
 * @returns
 */
function newExpDecaySampleHeap (reservoirSize) {
  let values = /** @type expDecaySample[] */([])

  /**
   * @param {number} j
   */
  const up = (j) => {
    while (true) {
      const i = (j - 1) / 2 // parent
      if (i === j || !(values[j].k < values[i].k)) {
        break
      }
      [values[i], values[j]] = [values[j], values[i]]
      j = i
    }
  }

  /**
   * @param {number} i
   * @param {number} n
   */
  const down = (i, n) => {
    while (true) {
      const j1 = 2 * i + 1
      if (j1 >= n || j1 < 0) { // j1 < 0 after int overflow
        break
      }
      let j = j1 // left child
      const j2 = j1 + 1
      if (j2 < n && !(values[j1].k < values[j2].k)) {
        j = j2 // = 2*i + 2  // right child
      }
      if (!(values[j].k < values[i].k)) {
        break
      }
      [values[i], values[j]] = [values[j], values[i]]
      i = j
    }
  }

  return {
    clear: () => {
      values = []
    },
    /**
     * @param {expDecaySample} s
     */
    push: (s) => {
      const n = values.length
      values[n] = s
      up(n)
    },
    pop: () => {
      const n = values.length - 1;
      [values[0], values[n]] = [values[n], values[0]]
      down(0, n)

      return values.pop()
    },
    size: () => values.length,
    values: () => [...values]
  }
}
