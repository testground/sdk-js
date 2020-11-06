const runtime = require('./runtime')
const sync = require('./sync')
const network = require('./network')

async function invokeMap (cases) {
  const runenv = runtime.currentRunEnv()

  if (cases[runenv.testCase]) {
    await invokeHelper(runenv, cases[runenv.testCase])
  } else {
    throw new Error(`unrecognized test case: ${runenv.testCase}`)
  }
}

async function invoke (fn) {
  const runenv = runtime.currentRunEnv()
  await invokeHelper(runenv, fn)
}

async function invokeHelper (runenv, fn) {
  runenv.recordStart()

  try {
    await fn(runenv)
    runenv.recordSuccess()
  } catch (err) {
    runenv.recordFailure(err)
  }
}

module.exports = {
  invoke,
  invokeMap,

  network,
  runtime,
  sync
}
