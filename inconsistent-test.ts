import {LiquidityPool, BasicPool, UniswapV1, WeightedPool} from './pool'

const initialX = 2_000_000 // USDT
const initialY = 1000 // ETH
const fee = 0.003
const pool1 = new WeightedPool(initialX, initialY, fee)
const pool2 = new WeightedPool(initialX, initialY, fee)


const y = pool1.swapX4Y(10)
const y2 = pool2.swapX4Y(10)

// console.log(y, y2)

const x1 = pool1.swapY4X(10);
const x2 = pool2.swapY4X(10);
// console.log(x1, x2)

// console.log(pool1.swapX4Y(10), pool1.swapX4Y(10))
// console.log(pool2.swapY4X(10), pool1.swapY4X(10))

pool1.swapX4Y(10)
pool1.swapX4Y(10)
pool1.swapX4Y(10)
pool1.swapX4Y(10)
pool1.swapX4Y(10)
pool1.swapX4Y(10)
pool1.swapX4Y(10)
pool1.swapX4Y(10)
pool1.swapX4Y(10)

pool2.swapY4X(10)
pool2.swapY4X(10)
pool2.swapY4X(10)
pool2.swapY4X(10)
pool2.swapY4X(10)
pool2.swapY4X(10)
pool2.swapY4X(10)

pool1.swapY4X(10)
pool1.swapY4X(10)
pool1.swapY4X(10)
pool1.swapY4X(10)
pool1.swapY4X(10)
pool1.swapY4X(10)
pool1.swapY4X(10)

pool2.swapX4Y(10)
pool2.swapX4Y(10)
pool2.swapX4Y(10)
pool2.swapX4Y(10)
pool2.swapX4Y(10)
pool2.swapX4Y(10)
pool2.swapX4Y(10)
pool2.swapX4Y(10)
pool2.swapX4Y(10)

const a1 = pool1.swapX4Y(10), a2 = pool2.swapX4Y(10)
console.log(a1, a2, `${(a1/a2 -1) * 100}%` )
const b1 = pool1.swapY4X(10), b2 = pool2.swapY4X(10)
console.log(b1, b2, `${(b1/b2 -1) * 100}%`)