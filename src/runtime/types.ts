import type { IPv4, IPv6 } from 'ipaddr.js'
import type { Logger } from 'winston'

export interface RunParams {
  testBranch: string
  testCase: string
  testGroupId: string
  testGroupInstanceCount: number
  testInstanceCount: number
  testInstanceParams: Record<string, string>
  testInstanceRole: string
  testOutputsPath: string
  testPlan: string
  testRepo: string
  testRun: string
  testSidecar: boolean
  testStartTime: number
  testSubnet: [IPv4 | IPv6, number]
  testTag: string
  toJSON: () => Object
}

export interface SignalEmitter {
  signalEvent: (event: Object) => void
}

export interface Events {
  /** Records an informational message. */
  recordMessage: (message: string) => void
  /** Records that the calling instance started. */
  recordStart: () => void
  /** Records that the calling instance succeeded. */
  recordSuccess: () => void
  /** Records that the calling instance failed with the supplied error. */
  recordFailure: (err: Error) => void
  /** Records that the calling instance crashed with the supplied error. */
  recordCrash: (err: Error) => void
}

export interface Metric {
  ts: number
  type: number
  name: string
  measures: Record<string, any>
}
export interface MetricsApi {
  recordPoint: (name: string, value: number) => void
  counter: (name: string) => Counter
  ewma: (name: string, alpha: number) => EWMA
  meter: (name: string) => Meter
  timer: (name: string) => Timer
}

export interface Metrics {
  d: MetricsApi
  r: MetricsApi
  close: () => void
}

export interface RunEnv extends Events, RunParams, Metrics {
  logger: Logger
  runParams: RunParams
  getSignalEmitter: () => SignalEmitter|null
  setSignalEmitter: (e: SignalEmitter) => void
}

export interface toMetric {
  toMetric: () => Metric
}
export interface Point extends toMetric {
  value: () => number
}

export interface Counter extends toMetric {
  clear: () => void
  count: () => number
  dec: (i: number) => void
  inc: (i: number) => void
}

export interface EWMA extends toMetric {
  rate: () => number
  tick: () => void
  update: (n: number) => void
}

export interface Gauge extends toMetric {
  update: (n: number) => void
  value: () => number
}

export interface Histogram extends toMetric {

}
export interface Meter extends toMetric {

}

export interface Timer extends toMetric {

}
