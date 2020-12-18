'use strict'

const { redisClient } = require('./redis')
const { createState } = require('./state')
const { createTopic } = require('./topic')
const { createSugar } = require('./sugar')

/** @typedef {import('winston').Logger} Logger */
/** @typedef {import('../runtime').RunEnv} RunEnv */
/** @typedef {import('../runtime').RunParams} RunParams */
/** @typedef {import('./types').SyncClient} SyncClient */

/**
 * Returns a new sync client that is bound to the provided runEnv. All the operations
 * will automatically be scoped to the keyspace of that run. You should call .close()
 * for a clean closure of the client.
 *
 * @param {RunEnv} runenv
 * @returns {Promise<SyncClient>}
 */
function newBoundClient (runenv) {
  return newClient(runenv.logger, () => Promise.resolve(runenv.runParams))
}

/**
 * @param {Logger} logger
 * @param {function():Promise<RunParams>} extractor
 * @returns {Promise<SyncClient>}
 */
async function newClient (logger, extractor) {
  const redis = await redisClient(logger)

  const base = {
    ...createState(logger, extractor, redis),
    ...createTopic(logger, extractor, redis)
  }

  return {
    ...base,
    ...createSugar(base),
    close: () => {
      redis.disconnect()
    }
  }
}

module.exports = {
  newBoundClient
}
