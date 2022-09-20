"use strict";
exports.__esModule = true;
var pool_1 = require("./pool");
var initialX = 2000000; // USDT
var initialY = 1000; // ETH
var fee = 0.003;
var pools = [
    new pool_1.BasicPool(initialX, initialY, fee),
    new pool_1.UniswapV1(initialX, initialY, fee),
    new pool_1.WeightedPool(initialX, initialY, fee),
];
pools.forEach(function (p, i) {
    console.log("=========== ", i, " ========");
    console.log('Market price:', p.x, p.y, p.marketPrice());
    p.deposit(initialX, initialY);
    console.log('Market price after add:', p.x, p.y, p.marketPrice());
    p.deposit(initialX, 0);
    console.log('Market price after add:', p.x, p.y, p.marketPrice());
    p.deposit(0, initialY);
    console.log('Market price after add:', p.x, p.y, p.marketPrice());
    var x = 10000;
    var y = p.swapX4Y(x);
    console.log('sold:', x, 'bought:', y, 'at price', x / y, 'market price after swap:', p.marketPrice());
    var x1 = 100000;
    var y1 = p.swapX4Y(x1);
    console.log('sold:', x1, 'bought:', y1, 'at price', x1 / y1, 'market price after swap', p.marketPrice());
    p.deposit(100000, 0);
    var x2 = 100000;
    var y2 = p.swapX4Y(x1);
    console.log('sold:', x2, 'bought:', y2, 'at price', x2 / y2, 'market price after swap', p.marketPrice());
});
