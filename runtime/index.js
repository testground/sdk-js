const ip = require('ip')

const ENV_TEST_BRANCH = 'TEST_BRANCH'
const ENV_TEST_CASE = 'TEST_CASE'
const ENV_TEST_GROUP_ID = 'TEST_GROUP_ID'
const ENV_TEST_GROUP_INSTANCE_COUNT = 'TEST_GROUP_INSTANCE_COUNT'
const ENV_TEST_INSTANCE_COUNT = 'TEST_INSTANCE_COUNT'
const ENV_TEST_INSTANCE_PARAMS = 'TEST_INSTANCE_PARAMS'
const ENV_TEST_INSTANCE_ROLE = 'TEST_INSTANCE_ROLE'
const ENV_TEST_OUTPUTS_PATH = 'TEST_OUTPUTS_PATH'
const ENV_TEST_PLAN = 'TEST_PLAN'
const ENV_TEST_REPO = 'TEST_REPO'
const ENV_TEST_RUN = 'TEST_RUN'
const ENV_TEST_SIDECAR = 'TEST_SIDECAR'
const ENV_TEST_START_TIME = 'TEST_START_TIME'
const ENV_TEST_SUBNET = 'TEST_SUBNET'
const ENV_TEST_TAG = 'TEST_TAG'

function parseRunParams (env) {
  return {
    testBranch: env[ENV_TEST_BRANCH],
    testCase: env[ENV_TEST_CASE],
    testGroupID: env[ENV_TEST_GROUP_ID],
    testGroupInstanceCount: Number.parseInt(env[ENV_TEST_GROUP_INSTANCE_COUNT]),
    testInstanceCount: Number.parseInt(env[ENV_TEST_INSTANCE_COUNT]),
    testInstanceParams: unpackParams(env[ENV_TEST_INSTANCE_PARAMS]),
    testInstanceRole: env[ENV_TEST_INSTANCE_ROLE],
    testOutputsPath: env[ENV_TEST_OUTPUTS_PATH],
    testPlan: env[ENV_TEST_PLAN],
    testRepo: env[ENV_TEST_REPO],
    testRun: env[ENV_TEST_RUN],
    testSidecar: env[ENV_TEST_SIDECAR] === 'true',
    testStartTime: Date.parse(ENV_TEST_START_TIME),
    testSubnet: ip.cidrSubnet(env[ENV_TEST_SUBNET]),
    testTag: env[ENV_TEST_TAG]
  }
}

function unpackParams (packed) {
  const spltparams = packed.split('|')
  const params = {}

  for (const s of spltparams) {
    const v = s.split('=')
    if (v.length !== 2) {
      continue
    }
    params[v[0]] = v[1]
  }

  return params
}

function currentRunEnv () {
  return parseRunEnv(process.env)
}

function parseRunEnv (env) {
  const p = parseRunParams(env)
  return new RunEnv(p)
}

class RunEnv {
  constructor (params) {
    this.runParams = params

    for (const param in params) {
      this[param] = params[param]
    }
  }

  recordMessage () {
    // TODO
  }

  recordStart () {
    // TODO
  }

  recordSuccess () {
    // TODO
  }

  recordFailure () {
    // TODO
  }

  recordCrash () {
    // TODO
  }
}

module.exports = {
  RunEnv,
  currentRunEnv,
  parseRunEnv
}
