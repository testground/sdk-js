function newEvents ({ logger, runParams, getSignalEmitter }) {
  const emitEvent = async (event) => {
    const signalEmitter = getSignalEmitter()

    if (!signalEmitter) {
      return
    }

    try {
      await signalEmitter.signalEvent(event)
    } catch (_) {}
  }

  return {
    recordMessage: (msg) => {
      const event = {
        message_event: {
          message: msg
        }
      }

      logger.info('', { event })
      emitEvent(event)
    },
    recordStart: () => {
      const event = {
        start_event: {
          runenv: runParams
        }
      }

      logger.info('', { event })
      emitEvent(event)
      // TODO: re.metrics.recordEvent(&evt)
    },
    recordSuccess: () => {
      const event = {
        success_event: {
          group: runParams.testGroupID
        }
      }

      logger.info('', { event })
      emitEvent(event)
      // TODO: re.metrics.recordEvent(&evt)
    },
    recordFailure: (err) => {
      const event = {
        failure_event: {
          group: runParams.testGroupID,
          error: err.toString()
        }
      }

      logger.info('', { event })
      emitEvent(event)
      // TODO: re.metrics.recordEvent(&evt)
    },
    recordCrash: (err) => {
      const event = {
        crash_event: {
          group: runParams.testGroupID,
          error: err.toString(),
          stacktrace: err.stack
        }
      }

      logger.info('', { event })
      emitEvent(event)
      // TODO: re.metrics.recordEvent(&evt)
    }
  }
}

module.exports = {
  newEvents
}
