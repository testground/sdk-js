'use strict'

function getLogger () {
  return {
    debug: function (...args) {
      console.debug(...args)
    },
    info: function (...args) {
      console.info(...args)
    },
    warn: function (...args) {
      console.warn(...args)
    },
    error: function (...args) {
      console.error(...args);
    }
  };
}

module.exports = {
  getLogger
}
