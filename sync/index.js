function newBoundClient (runenv) {
  // TODO
  return newClient()
}

function newGenericClient (logger) {
  // TODO
  return newClient()
}

function newClient () {
  return {
    barrier: (state, target) => {
      // TODO
    },
    publish: (topic, payload) => {
      // TODO
    },
    publishAndWait: (topic, payload, state, target) => {
      // TODO
    },
    publishSubscribe: (topic, payload) => {
      // TODO
    },
    signalAndWait: (state, target) => {
      // TODO
    },
    signalEntry: (state) => {
      // TODO
    },
    subscribe: (topic) => {
      // TODO
    }
  }
}

module.exports = {
  newBoundClient,
  newGenericClient
}
