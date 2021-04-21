'use strict'

const fetch = require('cross-fetch')

/**
 * @param {string} host
 * @param {string|number} port
 * @returns {any}
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
