import * as Runtime from './runtime'
import * as Sync from './sync'
import * as Network from './network'

export function invoke (fn: Function): null

export function invokeMap (cases: Object): null

export declare var runtime: typeof Runtime
export declare var sync: typeof Sync
export declare var network: typeof Network
