'use strict'

const ipaddr = require('ipaddr.js')

const { getProcessEnv } = require('./env')

/** @typedef {import('./types').RunParams} RunParams */

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

const ENV_TEST_PARAMETERS = [
  ENV_TEST_BRANCH,
  ENV_TEST_CASE,
  ENV_TEST_GROUP_ID,
  ENV_TEST_GROUP_INSTANCE_COUNT,
  ENV_TEST_INSTANCE_COUNT,
  ENV_TEST_INSTANCE_PARAMS,
  ENV_TEST_INSTANCE_ROLE,
  ENV_TEST_OUTPUTS_PATH,
  ENV_TEST_PLAN,
  ENV_TEST_REPO,
  ENV_TEST_RUN,
  ENV_TEST_SIDECAR,
  ENV_TEST_START_TIME,
  ENV_TEST_SUBNET,
  ENV_TEST_TAG
]

/**
 * Gets the parameters from the environment
 * that can be used by the environment to create the runtime.
 *
 * @returns {Record<string, string|undefined>}
 */
function getEnvParameters () {
  const env = getProcessEnv()
  return Object.keys(env)
    .filter(key => ENV_TEST_PARAMETERS.includes(key))
    .reduce((/** @type {Record<string, string|undefined>} */params, key) => {
      params[key] = env[key]
      return params
    }, {})
}

/**
 * @param {Record<string, string|undefined>} env
 * @returns {RunParams}
 */
function parseRunParams (env) {
  const params = /** @type {RunParams} */({})

  params.testBranch = env[ENV_TEST_BRANCH] || ''
  params.testCase = env[ENV_TEST_CASE] || ''
  params.testGroupId = env[ENV_TEST_GROUP_ID] || ''
  params.testGroupInstanceCount = Number.parseInt(env[ENV_TEST_GROUP_INSTANCE_COUNT] || '')
  params.testInstanceCount = Number.parseInt(env[ENV_TEST_INSTANCE_COUNT] || '')
  params.testInstanceParams = unpackParams(env[ENV_TEST_INSTANCE_PARAMS] || '')
  params.testInstanceRole = env[ENV_TEST_INSTANCE_ROLE] || ''
  params.testOutputsPath = env[ENV_TEST_OUTPUTS_PATH] || ''
  params.testPlan = env[ENV_TEST_PLAN] || ''
  params.testRepo = env[ENV_TEST_REPO] || ''
  params.testRun = env[ENV_TEST_RUN] || ''
  params.testSidecar = env[ENV_TEST_SIDECAR] === 'true'
  params.testStartTime = Date.parse(ENV_TEST_START_TIME)
  params.testSubnet = ipaddr.parseCIDR(env[ENV_TEST_SUBNET] || '')
  params.testTag = env[ENV_TEST_TAG] || ''

  params.toJSON = () => {
    const json = {
      plan: params.testPlan,
      case: params.testCase,
      run: params.testRun,
      instances: params.testInstanceCount,
      outputs_path: params.testOutputsPath,
      network: params.testSubnet.toString(),
      group: params.testGroupId,
      group_instances: params.testGroupInstanceCount,
      repo: '',
      branch: '',
      tag: ''
    }

    if (params.testRepo) {
      json.repo = params.testRepo
    }

    if (params.testBranch) {
      json.branch = params.testBranch
    }

    if (params.testTag) {
      json.tag = params.testTag
    }

    return json
  }

  return params
}

/**
 * @param {string} packed
 * @returns {Record<string, string>}
 */
function unpackParams (packed) {
  const spltparams = packed.split('|')
  const params = /** @type {Record<string, string>} */({})

  for (const s of spltparams) {
    const v = s.split('=')
    if (v.length === 2) {
      params[v[0]] = v[1]
    }
  }

  return params
}

module.exports = {
  getEnvParameters,
  parseRunParams
}
