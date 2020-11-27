import { Logger } from 'winston'
import { Params } from './params'

export interface Events {
  /**
   * Records a message event
   * @param msg - the message to record
   */
  recordMessage: (msg: string) => null
  /**
   * Records a start event
   */
  recordStart: () => null
  /**
   * Records a success event
   */
  recordSuccess: () => null
  /**
   * Records a failure event
   * @param err - the error that caused the failure
   */
  recordFailure: (err: Error) => null
  /**
   * Records a crash event
   * @param err - the error that caused the crash
   */
  recordCrash: (err: Error) => null
}

export interface SignalEmitter {
  signalEvent: (event: object) => null
}

export class EventsOptions {
  logger: Logger
  runParams: Params
  getSignalEmitter?: SignalEmitter
}

export function newEvents (options: EventsOptions): Events
