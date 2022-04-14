'use strict'

const runtime = require('./runtime')
const sync = require('./sync')
const network = require('./network')

/** @typedef {import('./runtime').RunEnv} RunEnv */
/** @typedef {import('./sync').SyncClient} SyncClient */

/**
 * Takes a map of test case names and their functions, and calls the matched
 * test case, or throws an error if the name is unrecognized.
 *
 * @param {Record<string, function(RunEnv):Promise<void>>} cases
 */
async function invokeMap (cases) {
  const runenv = runtime.currentRunEnv()

  if (cases[runenv.testCase]) {
    await invokeHelper(runenv, cases[runenv.testCase])
  } else {
    throw new Error(`unrecognized test case: ${runenv.testCase}`)
  }
}

/**
 * Runs the passed test-case and reports the result.
 *
 * @param {function(RunEnv):Promise<void>} fn
 */
async function invoke (fn) {
  const runenv = runtime.currentRunEnv()
  await invokeHelper(runenv, fn)
}

/**
 * @param {RunEnv} runenv
 * @param {function(RunEnv, SyncClient?):Promise<void>} fn
 */
async function invokeHelper (runenv, fn) {
  let client = /** @type {SyncClient|null} */ (null)

  if (fn.length >= 2) {
    client = await sync.newBoundClient(runenv)
    runenv.setSignalEmitter(client)
  }

  await runenv.recordStart()

  try {
    await fn(runenv, client)
    await runenv.recordSuccess()
  } catch (err) {
    await runenv.recordFailure(err)
  } finally {
    if (client) {
      client.close()
    }
  }
}

module.exports = {
  invoke,
  invokeMap,

  network,
  runtime,
  sync
}
