'use strict'

const { fetch } = require('cross-fetch')

const REDIS_PAYLOAD_KEY = 'p'
const ENV_WEBDIS_HOST = 'WEBDIS_HOST'
const ENV_WEBDIS_PORT = 'WEBDIS_PORT'

/** @typedef {import('./types').Redis} Redis */

/**
 * @param {import('winston').Logger} logger
 * @returns {Promise<Redis>}
 */
async function redisClient (logger) {
  const host = process.env[ENV_WEBDIS_HOST] || '127.0.0.1'
  let port = 7379

  if (process.env[ENV_WEBDIS_PORT]) {
    port = Number.parseInt(process.env[ENV_WEBDIS_PORT] || '')
  }

  logger.debug('trying webdis host', { host, port })

  const client = newWebdis(host, port)

  // Check if connection works
  if (await client.ping() !== [true, 'PONG']) {
    throw new Error('failed to ping redis instance')
  }

  logger.debug('redis ping OK')
  return client
}

/**
 * @param {string} host
 * @param {string|number} port
 * @returns {Redis}
 */
function newWebdis (host, port) {
  const base = `http://${host}:${port}`

  /**
   *
   * @param {string} type
   * @returns {function(...any):any}
   */
  const requestMaker = type => async (...args) => {
    let url = `${base}/${type}`
    if (args && args.length) {
      url += `/${args.join('/')}`
    }

    const req = await fetch(url)
    const json = await req.json()
    return json[type]
  }

  return {
    ping: requestMaker('PING'),
    incr: requestMaker('INCR'),
    get: requestMaker('GET'),
    xadd: requestMaker('XADD'),
    xread: requestMaker('XREAD')
  }
}

module.exports = {
  redisClient,
  REDIS_PAYLOAD_KEY
}
