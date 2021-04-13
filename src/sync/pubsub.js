'use strict'

/** @typedef {import('../runtime').RunParams} RunParams */
/** @typedef {import('./types').PubSub} PubSub */
/** @typedef {import('./types').Response} Response */
/** @typedef {import('./types').Request} Request */
/** @typedef {import('./types').Socket} Socket */
/** @typedef {import('events').EventEmitter} EventEmitter */

/**
 * @param {import('winston').Logger} logger
 * @param {Socket} socket
 * @returns {PubSub}
 */
function createPubSub (logger, socket) {
  return {
    publish: async (topic, payload) => {
      const res = await socket.requestOnce({
        publish: {
          topic: topic,
          payload: payload
        }
      })

      if (res.error) {
        throw res.error
      }

      return res.publish.seq
    },
    subscribe: async (key) => {
      return socket.request({
        subscribe: {
          topic: key
        }
      })
    }
  }
}

module.exports = {
  createPubSub
}
