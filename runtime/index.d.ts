import { Logger } from 'winston'
import { Events, SignalEmitter } from './events'
import { Params } from './params'

export class RunEnv extends Params implements Events {
  runParams: Params
  logger: Logger

  recordMessage (msg: string): null
  recordStart (): null
  recordSuccess (): null
  recordFailure (err: Error): null
  recordCrash (err: Error): null

  getSignalEmitter (): SignalEmitter | null
  setSignalEmitter (e: SignalEmitter): null
}

export function newRunEnv (): RunEnv
export function currentRunEnv (): RunEnv
export function parseRunEnv (): RunEnv
