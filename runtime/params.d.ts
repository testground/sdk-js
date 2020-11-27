export class Params {
  testBranch: string
  testCase: string
  testGroupId: string
  testGroupInstanceCount: string
  testInstanceCount: number
  testInstanceParams: object
  testInstanceRole: string
  testOutputsPath: string
  testPlan: string
  testRepo: string
  testRun: string
  testSidecar: boolean
  testStartTime: Date
  testSubnet: object // TODO: ipaddr.CIDR?
  testTag: string
}

export function parseRunParams (env: object): Params
