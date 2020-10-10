const os = require('os')
const ipaddr = require('ipaddr.js')

function waitNetworkInitialized ({ client, runenv }) {
  return async () => {
    if (runenv.testSidecar) {
      try {
        const barrier = await client.barrier('network-initialized', runenv.testInstanceCount)
        await barrier.wait
      } catch (err) {
        runenv.recordMessage('network initialisation failed')
        throw err
      }
    }

    runenv.recordMessage('network initialisation successful')
  }
}

function configureNetwork ({ client, runenv }) {
  return async (config) => {
    if (!runenv.testSidecar) {
      runenv.logger.warn('ignoring network change request; running in a sidecar-less environment')
      return
    }

    if (!config.callbackState) {
      throw new Error('failed to configure network; no callback state provided')
    }

    const hostname = os.hostname()
    const topic = `network:${hostname}`
    const target = (!config.callbackTarget || config.callbackTarget === 0)
      ? runenv.testInstanceCount // Fall back to instance count on zero value.
      : config.callbackTarget

    await client.publishAndWait(topic, normalizeConfig(config), config.callbackState, target)
  }
}

// normalizeConfig converts the configuration from the JavaScript lowerCamelCase version to the
// Go CammelCase version. More about this is mentioned at https://github.com/testground/sdk-go/pull/34
function normalizeConfig (config) {
  if (typeof config !== 'object') {
    return config
  }

  if (Array.isArray(config)) {
    return config.map(fixConfig)
  }

  const parsed = {}

  for (let [key, value] of Object.entries(config)) {
    if (key === 'callbackState') key = 'State'
    if (key === 'ip') key = 'IP'
    parsed[key.charAt(0).toUpperCase() + key.slice(1)] = fixConfig(value)
  }

  return parsed
}

function getDataNetworkIP ({ client, runenv }) {
  return async () => {
    if (!runenv.testSidecar) {
      // this must be a local:exec runner and we currently don't support
      // traffic shaping on it for now, just return the loopback address
      return '127.0.0.1'
    }

    const ifaces = os.networkInterfaces().flat()

    for (const { address, family } of ifaces) {
      if (family !== 'IPv4') {
        runenv.recordMessage(`ignoring non ip4 addr ${address}`)
        continue
      }

      const addr = ipaddr.parse(address)
      if (addr.match(runenv.testSubnet)) {
        runenv.recordMessage(`detected data network IP: ${address}`)
        return address
      } else {
        runenv.recordMessage(`${address} not in data subnet ${runenv.testSubnet.toString()}`)
      }
    }

    throw new Error(`unable to determine data network IP. no interface found with IP in ${runenv.testSubnet.toString()}`)
  }
}

function newClient (client, runenv) {
  const options = { client, runenv }

  return {
    waitNetworkInitialized: waitNetworkInitialized(options),
    configureNetwork: configureNetwork(options),
    getDataNetworkIP: getDataNetworkIP(options)
  }
}

module.exports = {
  newClient
}
