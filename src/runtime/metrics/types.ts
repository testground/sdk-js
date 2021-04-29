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
