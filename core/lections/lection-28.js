function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn(...args);
        } else {
            return function(...args2) {
                return curried(...args, ...args2);
            }
        }   
    }
}

const sum = (a, b, c) => a + b + c;
console.log(sum(1, 2, 3));

const currySum = curry(sum);

console.log(currySum(1)(2)(3));
console.log(currySum(1)(2, 3));
console.log(currySum(1, 2)(3));
console.log(currySum(1, 2, 3));

const sum1 = (a, b) => a + b;
console.log(sum1(1, 2));

const sum2 = curry((a, b) => a + b);
console.log(sum2(1)(2));

const greaterThan = curry((a, b) => a > b);

const swapArgs = fn => curry((a, b) => fn(b, a));

const arr = [1, 2, 3, 4];

console.log(arr.map(sum2)); // e, i => e + i
console.log(arr.map(sum2(2))); // e => e + 2
console.log(arr.filter(greaterThan(2))); // e => 2 > e
console.log(arr.filter(swapArgs(greaterThan)(2))); // e => e > 2

function bind(fn, thisArg, ...args) {
    return (...args2) => {
        fn.acll(thisArg, ...args, ...args2);
    }
}