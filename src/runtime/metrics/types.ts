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
  gauge: (name: string) => Gauge
  gaugeF: (name: string, func: () => number) => Gauge
  histogram: (name: string, sample: Sample) => Histogram
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

export interface Meter extends toMetric {

}

export interface Timer extends toMetric {

}

export interface Sample {
  clear: () => void
  count: () => number
  max: () => number
  mean: () => number
  min: () => number
  percentile: (n: number) => number
  percentiles: (n: number[]) => number[]
  size: () => number
  stdDev: () => number
  sum: () => number
  update: (n: number) => void
  values: () => number[]
  variance: () => number
}

export interface Histogram extends toMetric, Sample {
  sample: () => Sample
}
