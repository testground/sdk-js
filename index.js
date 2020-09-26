const HTTP_PORT = 6060
const HTTP_PORT_FALLBACK = 0

async function invokeMap (cases) {
  const runenv = {} // TODO: get current environemnt

  if (cases[runenv.testCase]) {
    await invokeHelper(runenv, cases[runenv.testCase])
  } else {
    throw new Error(`unrecognized test case: ${runenv.testCase}`)
  }
}

async function invoke (fn) {
  const runenv = {} // TODO: get current environemnt
  await invokeHelper(runenv, fn)
}

async function invokeHelper (runenv, fn) {
  // TODO: the rest of the checks
  await fn(runenv)
}

module.exports = {
  invoke,
  invokeMap
}
