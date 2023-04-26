"use strict";
exports.__esModule = true;
var pool_1 = require("./pool");
var initialX = 200000000; // USDT
var initialY = 100000; // ETH
var fee = 0.003;
var times = 100;
// two side deposit. 
var pool1 = new pool_1.WeightedPool(initialX * times, initialY * times, fee);
// single deposit X 
var pool2 = new pool_1.WeightedPool(initialX * times, initialY * times, fee);
// two sides deposit
var pool3 = new pool_1.WeightedPool(initialX * times, initialY * times, fee);
// single deposit Y
var pool4 = new pool_1.WeightedPool(initialX * times, initialY * times, fee);
var depositX = initialX;
var depositY = initialY;
var swapX = 100000;
var swapY = 100;
console.log("deposit: ", depositX, depositY);
pool1.deposit(depositX, depositY);
console.log('Market price after add:', pool1.x, pool1.y, pool1.marketPrice());
pool2.deposit(depositX * 2, 0);
console.log('Market price after add:', pool2.x, pool2.y, pool2.marketPrice());
var a1 = pool1.swapX4Y(swapX), a2 = pool2.swapX4Y(swapX);
var b1 = pool1.swapY4X(swapY), b2 = pool2.swapY4X(swapY);
console.log(a1, a2, a1 - a2, "".concat(((a1 / a2 - 1) * 100).toFixed(2), "%"));
console.log(b1, b2, b1 - b2, "".concat(((b1 / b2 - 1) * 100).toFixed(2), "%"));
pool3.deposit(depositX, depositY);
console.log('Market price after add:', pool3.x, pool3.y, pool3.marketPrice());
pool4.deposit(0, depositY * 2);
console.log('Market price after add:', pool4.x, pool4.y, pool4.marketPrice());
var c1 = pool3.swapX4Y(swapX), c2 = pool4.swapX4Y(swapX);
var d1 = pool3.swapY4X(swapY), d2 = pool4.swapY4X(swapY);
console.log(c1, c2, c1 - c2, "".concat(((c1 / c2 - 1) * 100).toFixed(2), "%"));
console.log(d1, d2, d1 - d2, "".concat(((d1 / d2 - 1) * 100).toFixed(2), "%"));
