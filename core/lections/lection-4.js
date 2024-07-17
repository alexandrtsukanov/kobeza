let a = 2;
console.log(16 >> 2)

let b = 69;
console.log(~b + 1);

const encoded = (13 << 24) | (56 << 16) | (128 << 8) | (204);
console.log(encoded.toString(2))

function createMask(len, pos) { // pos - позиция до левого края справа
    let r = ~0;
    r <<= 32 - len;
    r >>>= 32 - pos; // Надо использовать логический сдвиг
    return r;
}

console.log((encoded & createMask(8, 24)) >>> 16); // 16 - позиция до правого края справа (или на сколько бит сдвигали при группировке)

const group2 = 6 | 0
// (6 << 16) | (5 << 12) | (5 << 8) | 
// (6 << 16) | (5 << 12) | (5 << 8) | (3 << 4) | (6);
console.log(group2.toString(2))