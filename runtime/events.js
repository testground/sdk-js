const EVENT_TYPE_START = 'start'
const EVENT_TYPE_MESSAGE = 'message'
const EVENT_TYPE_FINISH = 'finish'

const EVENT_OUTCOME_OK = 'ok'
const EVENT_OUTCOME_FAILED = 'failed'
const EVENT_OUTCOME_CRASHED = 'crashed'

function newEvents ({ logger, runParams }) {
  return {
    recordMessage: (msg) => {
      const event = {
        type: EVENT_TYPE_MESSAGE,
        message: msg
      }

      logger.info('', { event })
    },
    recordStart: () => {
      const event = {
        type: EVENT_TYPE_START,
        runenv: runParams
      }

      logger.info('', { event })
      // TODO: re.metrics.recordEvent(&evt)
    },
    recordSuccess: () => {
      const event = {
        type: EVENT_TYPE_FINISH,
        outcome: EVENT_OUTCOME_OK
      }

      logger.info('', { event })
      // TODO: re.metrics.recordEvent(&evt)
    },
    recordFailure: (err) => {
      const event = {
        type: EVENT_TYPE_FINISH,
        outcome: EVENT_OUTCOME_FAILED,
        error: err.toString()
      }

      logger.info('', { event })
      // TODO: re.metrics.recordEvent(&evt)
    },
    recordCrash: (err) => {
      const event = {
        type: EVENT_TYPE_FINISH,
        outcome: EVENT_OUTCOME_CRASHED,
        error: err.toString(),
        stacktrace: err.stack
      }

      logger.info('', { event })
      // TODO: re.metrics.recordEvent(&evt)
    }
  }
}

module.exports = {
  newEvents
}
