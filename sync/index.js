const { redisClient } = require('./redis')
const { createState } = require('./state')
const { createTopic } = require('./topic')
const { createSugar } = require('./sugar')

function newBoundClient (runenv) {
  return newClient(runenv.logger, () => runenv.runParams)
}

async function newClient (logger, extractor) {
  const redis = await redisClient(logger)

  const options = {
    logger, extractor, redis
  }

  // TODO: we need something to simulate contexts (or just deadlines)
  // on most of the fuctions.

  const base = {
    ...createState(options),
    ...createTopic(options)
  }

  return {
    ...base,
    ...createSugar(base),
    close: () => {
      return redis.disconnect()
    }
  }
}

module.exports = {
  newBoundClient
}
