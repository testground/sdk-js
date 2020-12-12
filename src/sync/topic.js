'use strict'

const { REDIS_PAYLOAD_KEY } = require('./redis')

function topicKey (topic, params) {
  return `run:${params.testRun}:plan:${params.testPlan}:case:${params.testCase}:topics:${topic}`
}

function publish ({ logger, extractor, redis }) {
  return async (topic, payload) => {
    const params = await extractor()
    if (!params) {
      throw new Error('no run parameters provided')
    }

    logger.debug('publishing item on topic', { topic, payload })

    const json = JSON.stringify(payload)
    logger.debug('serialized json payload', { topic, json })

    const key = topicKey(topic, params)
    logger.debug('resolved key for publish', { topic, key })

    const results = await redis
      .multi()
      .xadd(key, '*', REDIS_PAYLOAD_KEY, json)
      .xlen(key)
      .exec()

    const seq = results[1][1]
    logger.debug('successfully published item; sequence number obtained', { topic, seq })

    return seq
  }
}

function subscribe ({ logger, extractor, redis }) {
  return async (topic) => {
    const params = await extractor()
    if (!params) {
      throw new Error('no run parameters provided')
    }

    const key = topicKey(topic, params)
    let lastid = '0'
    let run = true

    const cancel = () => {
      run = false
    }

    const wait = (async function * () {
      while (run) { // eslint-disable-line
        const result = await redis.xread('COUNT', 10, 'BLOCK', 0, 'STREAMS', key, lastid)

        for (const [stream, values] of result) {
          if (stream !== key) {
            logger.debug("XREAD response: rcvd messages for a stream we're not subscribed to", { stream })
            break
          }

          for (const [id, [key, jsonPayload]] of values) {
            if (key !== REDIS_PAYLOAD_KEY) {
              logger.debug('XREAD response: invalid payload key', { stream, key })
              break
            }
            const payload = JSON.parse(jsonPayload)
            yield payload
            lastid = id
          }
        }
      }
    })()

    return {
      cancel,
      wait
    }
  }
}

module.exports = {
  createTopic: (options) => ({
    publish: publish(options),
    subscribe: subscribe(options)
  })
}
