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

function parseKeyValues (env) {
  const res = {}

  for (const d of env) {
    const splt = d.split('=')
    if (splt.length < 2) {
      throw new Error(`invalid key-value: ${d}`)
    }
    res[splt[0]] = splt.slice(1)
  }

  return res
}

function parseRunParams (env) {
  const m = parseKeyValues(env)
  return {
    TestBranch: m[ENV_TEST_BRANCH],
    TestCase: m[ENV_TEST_CASE],
    TestGroupID: m[ENV_TEST_GROUP_ID],
    TestGroupInstanceCount: Number.parseInt(m[ENV_TEST_GROUP_INSTANCE_COUNT]),
    TestInstanceCount: Number.parseInt(m[ENV_TEST_INSTANCE_COUNT]),
    TestInstanceParams: unpackParams(m[ENV_TEST_INSTANCE_PARAMS]),
    TestInstanceRole: m[ENV_TEST_INSTANCE_ROLE],
    TestOutputsPath: m[ENV_TEST_OUTPUTS_PATH],
    TestPlan: m[ENV_TEST_PLAN],
    TestRepo: m[ENV_TEST_REPO],
    TestRun: m[ENV_TEST_RUN],
    TestSidecar: m[ENV_TEST_SIDECAR] === 'true',
    TestStartTime: Date.parse(ENV_TEST_START_TIME),
    TestSubnet: ip.cidrSubnet(m[ENV_TEST_SUBNET]),
    TestTag: m[ENV_TEST_TAG]
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

class RunEnv {
  constructor (params) {
    this.runParams = params
  }

  static currentRunEnv () {
    return RunEnv.parseRunEnv(process.env)
  }

  static parseRunEnv (env) {
    const p = parseRunParams(env)
    return new RunEnv(p)
  }

  recordMessage () {

  }

  recordStart () {

  }

  recordSuccess () {

  }

  recordFailure () {

  }

  recordCrash () {

  }
}

module.exports = RunEnv
