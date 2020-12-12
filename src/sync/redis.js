'use strict'

const Redis = require('ioredis')

const REDIS_PAYLOAD_KEY = 'p'
const ENV_REDIS_HOST = 'REDIS_HOST'
const ENV_REDIS_PORT = 'REDIS_PORT'

async function redisClient (logger) {
  let port = 6379
  const host = process.env[ENV_REDIS_HOST]

  if (process.env[ENV_REDIS_PORT]) {
    port = Number.parseInt(process.env[ENV_REDIS_PORT])
  }

  logger.debug('trying redis host', { host, port })

  const opts = {
    port,
    host,
    maxRetriesPerRequest: 30
  }

  const client = new Redis(opts)

  // Check if connection works
  if (await client.ping() !== 'PONG') {
    throw new Error('failed to ping redis instance')
  }

  logger.debug('redis ping OK', opts)
  return client
}

module.exports = {
  redisClient,
  REDIS_PAYLOAD_KEY
}
