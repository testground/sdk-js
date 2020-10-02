const { redisClient } = require('./redis')

function newBoundClient (runenv) {
  return newClient(runenv.logger, () => runenv.runParams)
}

function newGenericClient (logger) {
  // TODO
  return newClient()
}

async function newClient (logger, extractor) {
  const redis = await redisClient(logger)

  return {
    barrier: (state, target) => {
      // a barrier with target zero is satisfied immediately; log a warning as
      // this is probably programmer error.
      if (target === 0) {
        logger.warn('requested a barrier with target zero; satisfying immediately', { state })
        const b = {}
        /*
        b := &Barrier{C: make(chan error, 1)}
        b.C <- nil
        close(b.C)
        return b, nil
        */
        return
      }

      const params = extractor()
      if (!params) {
        throw new Error('no run parameters provided')
      }

      // TODO
      const b = {
        state,
        target
      }

      /*

        b := &Barrier{
          C:      make(chan error, 1),
          state:  state,
          key:    state.Key(rp),
          target: int64(target),
          ctx:    ctx,
        }

        resultCh := make(chan error)
        c.barrierCh <- &newBarrier{b, resultCh}
        err := <-resultCh
        return b, err
  */

      return b
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
