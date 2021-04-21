export interface Barrier {
  state: string
  key: string
  target: number
  wait: Promise<void>
  cancel: () => void
}

export interface State {
  barrier: (state: string, target: number) => Promise<Barrier>
  signalEntry: (state: string) => Promise<number>
  signalEvent: (event: any) => void
}

export interface Subscribe {
  cancel: () => void
  wait: AsyncGenerator<any, void, unknown>
}

export interface Topic {
  publish: (topic: string, payload: any) => Promise<number>
  subscribe: (topic: string) => Promise<Subscribe>
}

export type StateAndTopic = State & Topic

export interface PublishSubscribe {
  seq: number
  sub: Subscribe
}

export interface Sugar {
  publishAndWait: (topic: string, payload: any, state: string, target: number) => Promise<number>
  publishSubscribe: (topic: string, payload: any) => Promise<PublishSubscribe>
  signalAndWait: (state: string, target: number) => Promise<number>
}

export interface SyncClient extends State, Topic, Sugar {
  close: () => void
}

export interface Redis {
  ping: (...args: any) => Promise<any>
  incr: (...args: any) => Promise<any>
  get: (...args: any) => Promise<any>
  xadd: (...args: any) => Promise<any>
  xread: (...args: any) => Promise<any>
}
