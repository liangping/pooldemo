// Cosmos SDK Coin
interface Coin {
    amount: number
    denom: string
}

interface PoolAsset {
    balance: Coin
    weight: number
}

enum PoolStatus {
    Ready,
    Initial,
}

interface IBCSwapBase {
    assets: PoolAsset[]
    feeRate: number // basis point
    status(): PoolStatus
    price(denomIn: string, denomOut: string): number
    deposit(amount: Coin[]) : number
    withdraw(poolToken: Coin, denomOut: string): Coin
    exactTokenInForTokenOut(tokenIn: Coin, denomOut: String, exact: boolean): Coin
    tokenInForExactTokenOut(denomIn: string, tokenOut: Coin, exact: boolean): Coin
}

// convert "50:50" to [0.5, 0.5]
export function parseWeightString(weight: string) {
    const w = weight.split(":").map(x => Number(x)/100)
    return w // need make sure sum is 1
}

/// Inspired by Balancer: IBCSwap use invariant: V = π Bt ** Wt
export default class IBCSwapV1 implements IBCSwapBase {
    assets: PoolAsset[]
    feeRate: number
    poolToken: Coin
    constructor(coins: string[], weight: string, feeRate: number ) {
        if(coins.length != 2 ) 
           throw new Error("Only support two assets")
        const numWeight = parseWeightString(weight) 
        if(coins.length != numWeight.length) 
           throw new Error("Tokens and Weight are not matched")
        
        this.feeRate = feeRate
        this.poolToken = {
            amount: 1, // maybe should be 0. 
            denom: 'Hash(trading pair)'
        }
        this.assets = coins.map((x, i) => {
            return {
                balance: {
                    amount: 0,
                    denom: x
                },
                weight: numWeight[i]
            }
        })
    }

    status(): PoolStatus {
        return PoolStatus.Ready // fetch parameter.
    }
    price(denomIn: string, denomOut: string): number {
        const Ti = this.findAssetByDenom(denomIn)
        const To = this.findAssetByDenom(denomOut)
        const Bi = Ti.balance.amount
        const Bo = To.balance.amount
        const Wi = Ti.weight
        const Wo = To.weight
        
        return Bi / Wi / (Bo / Wo);
    }
    deposit(amount: Coin[]): number {
        if(amount.length === 1) {
            return this.depositSingleAsset(amount[0])
        }
        if(amount.length === 2) {
            return this.depositMultiAssets(amount)
        }
        throw new Error("Not supported")
    }

    // At = Bt * (1 - (1 - P_redeemed / P_supply) ** 1/Wt)
    withdraw(toRedeem: Coin, denomOut: string): Coin {
        if(toRedeem.denom !== this.poolToken.denom) 
            throw new Error("Method not implemented.")

        const redeem = this.findAssetByDenom(denomOut)
        const At = redeem.balance.amount * (1 - (1 - toRedeem.amount/this.poolToken.amount) ** (1/redeem.weight))
        return {
            amount: At,
            denom: denomOut,
        }
    }

    // OutGivenIn
    // Ao = Bo * ((1 - Bi / (Bi + Ai)) ** Wi/Wo)
    exactTokenInForTokenOut(Ai: Coin, denomOut: string, exact: boolean): Coin {
       const Bi = this.findAssetByDenom(Ai.denom)
       const Bo = this.findAssetByDenom(denomOut)
       const Ao = Bo.balance.amount * (1 - (Bi.balance.amount / (Bi.balance.amount + Ai.amount)) ** (Bi.weight/Bo.weight))
       return {
          amount: Ao,
          denom: denomOut,
       } 
    }

    // InGivenOut
    // Ai = Bi * ((Bo/(Bo - Ao)) ** Wo/Wi -1)
    tokenInForExactTokenOut(denomIn: string, Ao: Coin, exact: boolean): Coin {
        const Bi = this.findAssetByDenom(denomIn)
        const Bo = this.findAssetByDenom(Ao.denom)
        const Ai = Bi.balance.amount * ((Bo.balance.amount/(Bo.balance.amount - Ao.amount)) ** (Bo.weight/Bi.weight))
        return {
            amount: Ai,
            denom: denomIn
        }
    }

    private findAssetByDenom(denom: string) : PoolAsset {
        const asset = this.assets.find(x => x.balance.denom === denom)
        if(asset) return asset
        throw new Error("Token not found in the pool")
    }

    private depositSingleAsset(token: Coin) : number {
        const Bt = this.findAssetByDenom(token.denom)
        Bt.balance.amount += token.amount * (1 - this.feeRate) // update pool states

        // P_issued = P_supply * ((1 + At/Bt) ** Wt -1)
        const issue = this.poolToken.amount * ((1 + token.amount/Bt.balance.amount) ** Bt.weight -1 )
        return issue
    }

    // Dt = ((P_supply + P_issued) / P_supply - 1) * Bt
    private depositMultiAssets(tokens: Coin[]) : number {
        tokens.forEach(token => {
            const Bt = this.findAssetByDenom(token.denom)
            Bt.balance.amount += token.amount // update pool states
        })
        return 0
    }
   
} 


interface IBCSwapDelegator {
    delegateCreate(assets: PoolAsset[])
    delegateDeposit(amount: Coin[]) : number
    delegateWithdraw(poolAssets: PoolAsset): Coin[]
    delegateTokenInForExactTokenOut(tokenIn: Coin, exact: boolean): Coin
    delegateExactTokenInForTokenOut(tokenIn: Coin, exact: boolean): Coin

    onCreate(assets: PoolAsset[])
    onDeposit(amount: Coin[]) : number
    onWithdraw(poolAssets: PoolAsset): Coin[]
    onTokenInForExactTokenOut(tokenIn: Coin, exact: boolean): Coin
    onExactTokenInForTokenOut(tokenIn: Coin, exact: boolean): Coin
}