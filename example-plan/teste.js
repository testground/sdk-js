
const os = require('os')

console.log(
  sameAddrs(os.networkInterfaces(), os.networkInterfaces())
)

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
