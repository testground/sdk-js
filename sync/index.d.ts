import { RunEnv } from '../runtime'

export class Sync {

}

export function newClient (runenv: RunEnv): Sync
export function newBoundClient (logger: any, extractor: any): Sync
