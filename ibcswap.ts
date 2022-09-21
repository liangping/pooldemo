// Cosmos SDK Coin
interface Coin {
    amount: number
    denom: string
}

enum PoolSide {
    Native,
    Remote,
}

interface PoolAsset {
    side: PoolSide
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
    leftSwap(tokenIn: Coin, denomOut: String, exact: boolean): Coin
    rightSwap(denomIn: string, tokenOut: Coin, exact: boolean): Coin
    // estimatedSlippage(tokenIn: Coin, tokenOut: Coin): number 
}

// convert "50:50" to [0.5, 0.5]
export function parseWeightString(weight: string) {
    const w = weight.split(":").map(x => Number(x)/100)
    return w // need make sure sum is 1
}

export function isLocalNativeToken(denom: string) : PoolSide {
    // TODO: check if coin is native token 
    return denom.length < 5 ? PoolSide.Native: PoolSide.Remote
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
                side: isLocalNativeToken(x),
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
            throw new Error("Your pool assets are not accepted.")

        const redeem = this.findAssetByDenom(denomOut)
        const At = redeem.balance.amount * (1 - (1 - toRedeem.amount/this.poolToken.amount) ** (1/redeem.weight))
        return {
            amount: At,
            denom: denomOut,
        }
    }

    // OutGivenIn
    // Input how many coins you want to sell, output an amount you will receive
    // Ao = Bo * ((1 - Bi / (Bi + Ai)) ** Wi/Wo)
    leftSwap(Ai: Coin, denomOut: string, exact: boolean): Coin {
       const Bi = this.findAssetByDenom(Ai.denom)
       const Bo = this.findAssetByDenom(denomOut)
       const Ao = Bo.balance.amount * (1 - (Bi.balance.amount / (Bi.balance.amount + Ai.amount)) ** (Bi.weight/Bo.weight))
       return {
          amount: Ao,
          denom: denomOut,
       } 
    }

    // InGivenOut
    // Input how many coins you want to buy, output an amount you need to pay
    // Ai = Bi * ((Bo/(Bo - Ao)) ** Wo/Wi -1)
    rightSwap(denomIn: string, Ao: Coin, exact: boolean): Coin {
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

    // P_issued = P_supply * ((1 + At/Bt) ** Wt -1)
    private depositSingleAsset(token: Coin) : number {
        const Bt = this.findAssetByDenom(token.denom)
        Bt.balance.amount += token.amount * (1 - this.feeRate) // update pool states

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

///////////////////
//  Relayer Msg  //
///////////////////
enum MessageType {
    Create,
    Deposit,
    Withdraw,
    LeftSwap,
    RightSwap,
}

// IBCSwapDataPacket is used to wrap message for relayer.
interface IBCSwapDataPacket {
    msgType: MessageType,
    data: Uint8Array, // Bytes
}

interface IBCSwapAcknowledgeDataPacket {
    msgType: MessageType,
    data: Uint8Array, // Bytes
}


/////////////////////
// cosmos messages //
/////////////////////

interface MsgCreatePool {
    sender: string,
    denoms: string[],
    weight: string[],
}

interface MsgDeposit {
    sender: string,
    tokens: Coin[],
}

interface MsgWithdraw {
    sender: string,
    poolCoin: Coin,
    denomOut: string, // optional, if not set, withdraw native coin to sender.
}

interface MsgLeftSwap {
    sender: string,
    amountIn: Coin,
    denomOut: string,
    slippage: number; // max tolerated slippage 
}

interface MsgRightSwap {
    sender: string,
    denomIn: string,
    amountOut: Coin,
    slippage: number; // max tolerated slippage 
}


export class IBCSwapDelegator {
    delegateCreate(msg: MsgCreatePool) {

    }
    delegateDeposit(msg: MsgDeposit) {

    }
    delegateWithdraw(msg: MsgWithdraw) {

    }
    delegateLeftSwap(msg: MsgLeftSwap) {

    }
    delegateRightSwap(msg: MsgRightSwap) {

    }

    onCreate(msg: MsgCreatePool) {

    }
    onDeposit(msg: MsgDeposit) {

    }
    onWithdraw(msg: MsgWithdraw) {

    }
    onLeftSwap(msg: MsgLeftSwap) {

    }
    onRightSwap(msg: MsgRightSwap) {

    }
}