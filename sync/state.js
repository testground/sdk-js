const { REDIS_PAYLOAD_KEY } = require('./redis')

function sleep (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function stateKey (state, params) {
  return `run:${params.testRun}:plan:${params.testPlan}:case:${params.testCase}:states:${state}`
}

function eventsKey (params) {
  return `run:${params.testRun}:plan:${params.testPlan}:case:${params.testCase}:run_events`
}

function barrier ({ logger, extractor, redis }) {
  return async (state, target) => {
    // a barrier with target zero is satisfied immediately; log a warning as
    // this is probably programmer error.
    if (target === 0) {
      logger.warn('requested a barrier with target zero; satisfying immediately', { state })
      return {
        state,
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

        if (curr >= target) {
          logger.debug('barrier was hit; informing waiters', { key, target, curr })
          return
        } else {
          logger.debug('barrier still unsatisfied', { key, target, curr })
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
  }
}

function signalEntry ({ logger, extractor, redis }) {
  return async (state) => {
    const params = await extractor()
    if (!params) {
      throw new Error('no run parameters provided')
    }

    const key = stateKey(state, params)
    logger.debug('signalling entry to state', { key })

    const seq = await redis.incr(key)
    logger.debug('new value of state', { key, value: seq })

    return seq
  }
}

function signalEvent ({ logger, extractor, redis }) {
  return async (event) => {
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

module.exports = {
  createState: (options) => ({
    barrier: barrier(options),
    signalEntry: signalEntry(options),
    signalEvent: signalEvent(options)
  })
}
