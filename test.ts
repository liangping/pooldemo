import {LiquidityPool, BasicPool, UniswapV1, WeightedPool} from './pool'

const initialX = 2_000_000 // USDT
const initialY = 1000 // ETH
const fee = 0.003
const pools: LiquidityPool[] = [
    new BasicPool(initialX, initialY, fee), 
    new UniswapV1(initialX, initialY, fee),
    new WeightedPool(initialX, initialY, fee),
]

pools.forEach((p, i)=> {
   console.log("=========== ", i, " ========")
   console.log('Market price:', p.x, p.y, p.marketPrice())
   p.deposit(initialX, initialY)
   console.log('Market price after add:', p.x, p.y, p.marketPrice())
   p.deposit(initialX, 0)
   console.log('Market price after add:', p.x, p.y, p.marketPrice())
   p.deposit(0, initialY)
   console.log('Market price after add:', p.x, p.y, p.marketPrice())
   const x = 10_000
   const y = p.swapX4Y(x)
   console.log('sold:', x, 'bought:', y, 'at price', x/y, 'market price after swap:', p.marketPrice())


   const x1 = 100_000
   const y1 = p.swapX4Y(x1)
   console.log('sold:', x1, 'bought:', y1, 'at price', x1/y1, 'market price after swap', p.marketPrice())

   p.deposit(100_000, 0)
   const x2 = 100_000
   const y2 = p.swapX4Y(x1)
   console.log('sold:', x2, 'bought:', y2, 'at price', x2/y2, 'market price after swap', p.marketPrice())
})
