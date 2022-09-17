
export interface LiquidityPool {
    x: number
    y: number
    K: number
    fee: number
    deposit(x: number, y: number)
    swapX4Y(x: number): number
    marketPrice(): number
}

export class BasicPool implements LiquidityPool{
    x: number
    y: number
    K: number
    fee: number

    constructor (x: number, y: number, fee: number) {
        this.x = x
        this.y = y
        this.K = x * y
        this.fee = fee
    }

    deposit(x: number, y: number) {
        this.x += x
        this.y += y
        // this.K = this.x * this.y
    }

    marketPrice() : number {
        return this.x/this.y
    }

    remove(x: number, y: number) {
        this.deposit(-x, -y)
    }

    // swapX4Y(x: number) : number {
    //    const amount = x * (1-this.fee)
    //    this.x += amount
    //    const y = this.y * ( 1 - this.x / (this.x + amount))
    //    this.y -= y
    //    return y
    // }

    swapX4Y(x: number) : number {
        const amount = x * (1-this.fee)
        this.x += amount
        const old = this.y
        this.y = this.K/this.x
        return old - this.y
     }

    swapY4X(y: number) : number {
        const amount = y * (1-this.fee)
        this.y += amount
        const oldX = this.x
        this.x = this.K/this.y
        return oldX - this.x
     }
}
// The invariant: K = x * y
export class UniswapV1 implements LiquidityPool {
    x: number
    y: number
    K: number
    fee: number
    constructor (x: number, y: number, fee: number) {
        this.x = x
        this.y = y
        this.K = x * y
        this.fee = fee
    }
    deposit(x: number, y: number) {
        this.x += x
        this.y += y
    }
    swapX4Y(x: number): number {
        const inputAmount = x * (1-this.fee)
        const inputReserve = this.x
        const outputReserve = this.y

        // Output amount bought
        const numerator = inputAmount * outputReserve * 997
        const denominator = inputReserve * 1000 + inputAmount * 997
        const outputAmount = numerator / denominator
        this.x += x
        this.y -= outputAmount
        return outputAmount
    }
    marketPrice(): number {
        return this.x/this.y
    }
    
}
// The invariant: K = x ** wb * y ** wb from balancer
export class WeightedPool implements LiquidityPool {
    x: number
    y: number
    K: number
    fee: number
    wx: number
    wy: number
    constructor (x: number, y: number, fee: number) {
        this.x = x
        this.y = y
        this.K = x * y
        this.fee = fee
        this.wx = 0.5
        this.wy = 0.5
    }
    deposit(x: number, y: number) {
        this.x += x
        this.y += y
    }
    swapX4Y(x: number): number {
        const amount = x * (1 - this.fee)
        const out = this.y * (1 - (this.x / (this.x + amount)) ** (this.wx / this.wy) )
        this.x += amount
        this.y -= out
        return out
    }
    marketPrice(): number {
        return this.x/this.wx / (this.y/this.wy)
        // const Ai = 10
        // return Ai / (this.y * (1 - (this.x / (this.x + Ai) ** this.wx/this.wy)))
    }
    
}
