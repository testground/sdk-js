'use strict'

const { REDIS_PAYLOAD_KEY } = require('./redis')

/** @typedef {import('../runtime').RunParams} RunParams */
/** @typedef {import('./types').State} State */

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * @param {string} state
 * @param {RunParams} params
 * @returns {string}
 */
function stateKey (state, params) {
  return `run:${params.testRun}:plan:${params.testPlan}:case:${params.testCase}:states:${state}`
}

/**
 * @param {RunParams} params
 * @returns {string}
 */
function eventsKey (params) {
  return `run:${params.testRun}:plan:${params.testPlan}:case:${params.testCase}:run_events`
}

/**
 * @param {import('winston').Logger} logger
 * @param {function():Promise<RunParams>} extractor
 * @param {import('ioredis').Redis} redis
 * @returns {State}
 */
function createState (logger, extractor, redis) {
  return {
    barrier: async (state, target) => {
      // a barrier with target zero is satisfied immediately; log a warning as
      // this is probably programmer error.
      if (target === 0) {
        logger.warn('requested a barrier with target zero; satisfying immediately', { state })
        return {
          state,
          key: '',
          target: target,
          cancel: () => {},
          wait: Promise.resolve()
        }
      }

      const params = await extractor()
      if (!params) {
        throw new Error('no run parameters provided')
      }

      const key = stateKey(state, params)
      let run = true

      const wait = (async () => {
        // NOTE(hacdias): o sdk-go, we have a barrierWorker that fetches all barriers at once.
        // For simplicity, I decided to create a async function here to wait for the result,
        // so we'll be executing a READ for each ongoing barrier. I'm not completely sure if this
        // is a good idea or if there is any specific reason why the Go implementation decided to go
        // for a global barrier worker.

        while (run) { // eslint-disable-line
          const curr = await redis.get(key)

          if (curr) {
            const num = Number.parseInt(curr)

            if (num >= target) {
              logger.debug('barrier was hit; informing waiters', { key, target, curr })
              return
            } else {
              logger.debug('barrier still unsatisfied', { key, target, curr })
            }
          }

          await sleep(1000) // 1s
        }
      })()

      const cancel = () => {
        run = false
      }

      return {
        state,
        key,
        target,
        wait,
        cancel
      }
    },
    signalEntry: async (state) => {
      const params = await extractor()
      if (!params) {
        throw new Error('no run parameters provided')
      }

      const key = stateKey(state, params)
      logger.debug('signalling entry to state', { key })

      const seq = await redis.incr(key)
      logger.debug('new value of state', { key, value: seq })

      return seq
    },
    signalEvent: async (event) => {
      const params = await extractor()
      if (!params) {
        throw new Error('no run parameters provided')
      }

      const key = eventsKey(params)
      logger.debug('signalling event', { key, value: event })

      const json = JSON.stringify(event)
      await redis.xadd(key, '*', REDIS_PAYLOAD_KEY, json)
      logger.debug('successfully signalled event', { key })
    }
  }
}

module.exports = {
  createState
}
