"use strict";
exports.__esModule = true;
exports.WeightedPool = exports.UniswapV1 = exports.BasicPool = void 0;
var BasicPool = /** @class */ (function () {
    function BasicPool(x, y, fee) {
        this.x = x;
        this.y = y;
        this.K = x * y;
        this.fee = fee;
    }
    BasicPool.prototype.deposit = function (x, y) {
        this.x += x;
        this.y += y;
        // this.K = this.x * this.y
    };
    BasicPool.prototype.marketPrice = function () {
        return this.x / this.y;
    };
    BasicPool.prototype.remove = function (x, y) {
        this.deposit(-x, -y);
    };
    // swapX4Y(x: number) : number {
    //    const amount = x * (1-this.fee)
    //    this.x += amount
    //    const y = this.y * ( 1 - this.x / (this.x + amount))
    //    this.y -= y
    //    return y
    // }
    BasicPool.prototype.swapX4Y = function (x) {
        var amount = x * (1 - this.fee);
        this.x += amount;
        var old = this.y;
        this.y = this.K / this.x;
        return old - this.y;
    };
    BasicPool.prototype.swapY4X = function (y) {
        var amount = y * (1 - this.fee);
        this.y += amount;
        var oldX = this.x;
        this.x = this.K / this.y;
        return oldX - this.x;
    };
    return BasicPool;
}());
exports.BasicPool = BasicPool;
// The invariant: K = x * y
var UniswapV1 = /** @class */ (function () {
    function UniswapV1(x, y, fee) {
        this.x = x;
        this.y = y;
        this.K = x * y;
        this.fee = fee;
    }
    UniswapV1.prototype.deposit = function (x, y) {
        this.x += x;
        this.y += y;
    };
    UniswapV1.prototype.swapX4Y = function (x) {
        var inputAmount = x * (1 - this.fee);
        var inputReserve = this.x;
        var outputReserve = this.y;
        // Output amount bought
        var numerator = inputAmount * outputReserve * 997;
        var denominator = inputReserve * 1000 + inputAmount * 997;
        var outputAmount = numerator / denominator;
        this.x += x;
        this.y -= outputAmount;
        return outputAmount;
    };
    UniswapV1.prototype.marketPrice = function () {
        return this.x / this.y;
    };
    return UniswapV1;
}());
exports.UniswapV1 = UniswapV1;
// The invariant: K = x ** wb * y ** wb from balancer
var WeightedPool = /** @class */ (function () {
    function WeightedPool(x, y, fee) {
        this.x = x;
        this.y = y;
        this.K = x * y;
        this.fee = fee;
        this.wx = 0.5;
        this.wy = 0.5;
    }
    WeightedPool.prototype.deposit = function (x, y) {
        this.x += x;
        this.y += y;
    };
    WeightedPool.prototype.swapX4Y = function (x) {
        var amount = x * (1 - this.fee);
        var out = this.y * (1 - Math.pow((this.x / (this.x + amount)), (this.wx / this.wy)));
        this.x += amount;
        this.y -= out;
        return out;
    };
    WeightedPool.prototype.swapY4X = function (y) {
        var amount = y * (1 - this.fee);
        var out = this.x * (1 - Math.pow((this.y / (this.y + amount)), (this.wy / this.wx)));
        this.y += amount;
        this.x -= out;
        return out;
    };
    WeightedPool.prototype.marketPrice = function () {
        return this.x / this.wx / (this.y / this.wy);
        // const Ai = 10
        // return Ai / (this.y * (1 - (this.x / (this.x + Ai) ** this.wx/this.wy)))
    };
    return WeightedPool;
}());
exports.WeightedPool = WeightedPool;
