// This is an example plan. This plan is being used to test out the
// public API of this package. It may not be the best example as it
// will change over time will the package is produced. In the end,
// this will be deleted.

const os = require('os')
const { invokeMap, sync, network } = require('../')

const testcases = {
  pingpong: pingpong
}

;(async () => {
  // This is the plan entry point.
  await invokeMap(testcases)
})()

// TODO
async function pingpong (runenv) {
  runenv.recordMessage('before sync.MustBoundClient')
  const client = await sync.newBoundClient(runenv)

  if (!runenv.testSidecar) {
    return
  }

  const netclient = network.newClient(client, runenv)
  runenv.recordMessage('before netclient.MustWaitNetworkInitialized')
  await netclient.waitNetworkInitialized()

  const oldAddrs = os.networkInterfaces()

  const config = {
    network: 'default',
    enable: true,
    default: {
      latency: 100, // in milliseconds
      badwidth: 1 << 20 // 1 Mib
    },
    callbackState: 'network-configured',
    routingPolicy: 'deny-all' // TODO: make constants
  }

  runenv.recordMessage('before netclient.MustConfigureNetwork')
  await netclient.configureNetwork(config)

  const seq = await client.signalAndWait('ip-allocation', runenv.testInstanceCount)

  // Make sure that the IP addresses don't change unless we request it.
  const newAddrs = os.networkInterfaces()
  if (!sameAddrs(oldAddrs, newAddrs)) {
    throw new Error('interfaces changed')
  }

  runenv.recordMessage(`I am ${seq}`)

  const ipC = (seq >> 8) + 1
  const ipD = seq

  /*

    config.IPv4 = &runenv.TestSubnet.IPNet
    config.IPv4.IP = append(config.IPv4.IP[0:2:2], ipC, ipD)
    config.CallbackState = "ip-changed"

    var (
      listener *net.TCPListener
      conn     *net.TCPConn
    )

    if seq == 1 {
      listener, err = net.ListenTCP("tcp4", &net.TCPAddr{Port: 1234})
      if err != nil {
        return err
      }
      defer listener.Close()
    }

    runenv.RecordMessage("before reconfiguring network")
    netclient.MustConfigureNetwork(ctx, config)

    switch seq {
    case 1:
      conn, err = listener.AcceptTCP()
    case 2:
      conn, err = net.DialTCP("tcp4", nil, &net.TCPAddr{
        IP:   append(config.IPv4.IP[:3:3], 1),
        Port: 1234,
      })
    default:
      return fmt.Errorf("expected at most two test instances")
    }
    if err != nil {
      return err
    }

    defer conn.Close()

    // trying to measure latency here.
    err = conn.SetNoDelay(true)
    if err != nil {
      return err
    }

    pingPong := func(test string, rttMin, rttMax time.Duration) error {
      buf := make([]byte, 1)

      runenv.RecordMessage("waiting until ready")

      // wait till both sides are ready
      _, err = conn.Write([]byte{0})
      if err != nil {
        return err
      }

      _, err = conn.Read(buf)
      if err != nil {
        return err
      }

      start := time.Now()

      // write sequence number.
      runenv.RecordMessage("writing my id")
      _, err = conn.Write([]byte{byte(seq)})
      if err != nil {
        return err
      }

      // pong other sequence number
      runenv.RecordMessage("reading their id")
      _, err = conn.Read(buf)
      if err != nil {
        return err
      }

      runenv.RecordMessage("returning their id")
      _, err = conn.Write(buf)
      if err != nil {
        return err
      }

      runenv.RecordMessage("reading my id")
      // read our sequence number
      _, err = conn.Read(buf)
      if err != nil {
        return err
      }

      runenv.RecordMessage("done")

      // stop
      end := time.Now()

      // check the sequence number.
      if buf[0] != byte(seq) {
        return fmt.Errorf("read unexpected value")
      }

      // check the RTT
      rtt := end.Sub(start)
      if rtt < rttMin || rtt > rttMax {
        return fmt.Errorf("expected an RTT between %s and %s, got %s", rttMin, rttMax, rtt)
      }
      runenv.RecordMessage("ping RTT was %s [%s, %s]", rtt, rttMin, rttMax)

      // Don't reconfigure the network until we're done with the first test.
      state := sync.State("ping-pong-" + test)
      client.MustSignalAndWait(ctx, state, runenv.TestInstanceCount)

      return nil
    }
    err = pingPong("200", 200*time.Millisecond, 215*time.Millisecond)
    if err != nil {
      return err
    }

    config.Default.Latency = 10 * time.Millisecond
    config.CallbackState = "latency-reduced"
    netclient.MustConfigureNetwork(ctx, config)

    runenv.RecordMessage("ping pong")
    err = pingPong("10", 20*time.Millisecond, 35*time.Millisecond)
    if err != nil {
      return err
    }
  */
}

function sameAddrs (a, b) {
  if (a.length !== b.length) {
    return false
  }

  a = Object.values(a)
    .flat()
    .reduce((acc, curr) => {
      if (!acc.includes(curr.cidr)) {
        acc.push(curr.cidr)
      }
      return acc
    }, [])

  b = Object.values(b).flat()

  for (const { cidr } of b) {
    if (!a.includes(cidr)) {
      return false
    }
  }

  return true
}
