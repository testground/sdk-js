function publishAndWait ({ publish, barrier }) {
  return async (topic, payload, state, target) => {
    const seq = await publish(topic, payload)
    const b = await barrier(state, target)
    await b.wait
    return seq
  }
}

function publishSubscribe ({ publish, subscribe }) {
  return async (topic, payload) => {
    const seq = await publish(topic, payload)
    const sub = await subscribe(topic)
    return { seq, sub }
  }
}

function signalAndWait ({ signalEntry, barrier }) {
  return async (state, target) => {
    const seq = await signalEntry(state)
    const b = await barrier(state, target)
    await b.wait
    return seq
  }
}

module.exports = {
  createSugar: (options) => ({
    publishAndWait: publishAndWait(options),
    publishSubscribe: publishSubscribe(options),
    signalAndWait: signalAndWait(options)
  })
}
