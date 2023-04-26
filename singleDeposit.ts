import { BasicPool, WeightedPool } from "./pool"

const initialX = 200_000_000 // USDT
const initialY = 100000 // ETH
const fee = 0.003

const times = 100

// two side deposit. 
const pool1 = new WeightedPool(initialX * times, initialY * times, fee)
// single deposit X 
const pool2 = new WeightedPool(initialX * times, initialY * times, fee)
// two sides deposit
const pool3 = new WeightedPool(initialX * times, initialY * times, fee)
// single deposit Y
const pool4 = new WeightedPool(initialX * times, initialY * times, fee)

const depositX = initialX
const depositY = initialY

const swapX = 100000
const swapY = 100

console.log("deposit: ", depositX, depositY)

pool1.deposit(depositX, depositY)
console.log('Market price after add:', pool1.x, pool1.y, pool1.marketPrice())
pool2.deposit(depositX * 2, 0)
console.log('Market price after add:', pool2.x, pool2.y, pool2.marketPrice())

const a1 = pool1.swapX4Y(swapX), a2 = pool2.swapX4Y(swapX)
const b1 = pool1.swapY4X(swapY), b2 = pool2.swapY4X(swapY)

console.log(a1, a2, a1-a2,  `${((a1/a2 - 1)*100).toFixed(2)}%`)
console.log(b1, b2, b1-b2, `${((b1/b2 - 1)*100).toFixed(2)}%`)

pool3.deposit(depositX, depositY)
console.log('Market price after add:', pool3.x, pool3.y, pool3.marketPrice())
pool4.deposit(0, depositY * 2)
console.log('Market price after add:', pool4.x, pool4.y, pool4.marketPrice())

const c1 = pool3.swapX4Y(swapX), c2 = pool4.swapX4Y(swapX)
const d1 = pool3.swapY4X(swapY), d2 = pool4.swapY4X(swapY)

console.log(c1, c2, c1-c2,  `${((c1/c2 - 1)*100).toFixed(2)}%`)
console.log(d1, d2, d1-d2, `${((d1/d2 - 1)*100).toFixed(2)}%`)


