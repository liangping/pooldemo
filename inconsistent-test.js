"use strict";
exports.__esModule = true;
var pool_1 = require("./pool");
var initialX = 2000000; // USDT
var initialY = 1000; // ETH
var fee = 0.003;
var pool1 = new pool_1.WeightedPool(initialX, initialY, fee);
var pool2 = new pool_1.WeightedPool(initialX, initialY, fee);
var y = pool1.swapX4Y(10);
var y2 = pool2.swapX4Y(10);
// console.log(y, y2)
var x1 = pool1.swapY4X(10);
var x2 = pool2.swapY4X(10);
// console.log(x1, x2)
// console.log(pool1.swapX4Y(10), pool1.swapX4Y(10))
// console.log(pool2.swapY4X(10), pool1.swapY4X(10))
pool1.swapX4Y(10);
pool1.swapX4Y(10);
pool1.swapX4Y(10);
pool1.swapX4Y(10);
pool1.swapX4Y(10);
pool1.swapX4Y(10);
pool1.swapX4Y(10);
pool1.swapX4Y(10);
pool1.swapX4Y(10);
pool2.swapY4X(10);
pool2.swapY4X(10);
pool2.swapY4X(10);
pool2.swapY4X(10);
pool2.swapY4X(10);
pool2.swapY4X(10);
pool2.swapY4X(10);
pool1.swapY4X(10);
pool1.swapY4X(10);
pool1.swapY4X(10);
pool1.swapY4X(10);
pool1.swapY4X(10);
pool1.swapY4X(10);
pool1.swapY4X(10);
pool2.swapX4Y(10);
pool2.swapX4Y(10);
pool2.swapX4Y(10);
pool2.swapX4Y(10);
pool2.swapX4Y(10);
pool2.swapX4Y(10);
pool2.swapX4Y(10);
pool2.swapX4Y(10);
pool2.swapX4Y(10);
var a1 = pool1.swapX4Y(10), a2 = pool2.swapX4Y(10);
console.log(a1, a2, "".concat((a1 / a2 - 1) * 100, "%"));
var b1 = pool1.swapY4X(10), b2 = pool2.swapY4X(10);
console.log(b1, b2, "".concat((b1 / b2 - 1) * 100, "%"));
