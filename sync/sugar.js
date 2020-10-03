function createSugar ({ publish, subscribe, barrier, signalEntry }) {
  return {
    publishAndWait: async (topic, payload, state, target) => {
      const seq = await publish(topic, payload)
      const b = await barrier(state, target)
      await b.wait
      return seq
    },
    publishSubscribe: async (topic, payload) => {
      const seq = await publish(topic, payload)
      const sub = await subscribe(topic)
      return { seq, sub }
    },
    signalAndWait: async (state, target) => {
      const seq = await signalEntry(state)
      const b = await barrier(state, target)
      await b.wait
      return seq
    }
  }
}

module.exports = {
  createSugar
}
