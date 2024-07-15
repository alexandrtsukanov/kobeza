class BCD {
    // Во избежание переполнение Double чисел на вход используем BigInt
    constructor(num) {
        this.num = num;
        this.isNegative = false;
        this.numbers = [];
        this.encodedNum = this.encode(num);
    }

    encode(num) {
        if (num < 0) {
            num = this.fillTo9(num);
            this.num = num;
            this.isNegative = true;
        }

        let currentNum = parseInt(num);
        let bcd = 0;
        let diff = 0;

        while (currentNum > 0) {
            const digit = currentNum % 10;
            bcd = (digit << diff) | bcd;
            diff += 4;
            this.numbers.push(digit);
            currentNum = Math.floor(currentNum / 10);
        }

        return bcd;
    }

    // Во избежание переполнение Double чисел на выход используем BigInt
    valueOf() {
        return this.encodedNum.toString(2);
    }

    // Возвращает разряд BCD числа по заданной позиции.
    // Отрицательная позиция означает разряд "с конца".
    get(pos) {
        let actualPos = pos;

        if (pos < 0) {
            actualPos = this.numbers.length - Math.abs(pos);
        }

        const mask = this.createMask(4, (this.numbers.length - actualPos) * 4);

        return (this.encodedNum & mask) >>> (this.numbers.length - actualPos - 1) * 4;
    }

    createMask(len, pos) {
        let r = ~0;
        r <<= 32 - len;
        r >>>= 32 - pos;
        return r;
    }

    fillTo9(n) {
        if (n < 0) {
            n = ~n + 1;
        }

        const digitsNum = this.countDigits(n);
        let ninesNum = 0;

        for (let i = 0; i < digitsNum; i += 1) {
            ninesNum += 9 * 10 ** (digitsNum - i - 1);
        }

        return ninesNum - n;
    }

    countDigits(n) {
        let count = 0;

        while (n > 0) {
            n = Math.floor(n / 10);
            count += 1;
        }

        return count;
    }

    add(n) {
        let a = this.num;
        let b = n;
        let xored = a ^ b;

        while ((a & b) !== 0) {
            let shifted = (a & b) << 1;
            a = xored;
            b = shifted;
            xored = a ^ b;
        }

        return xored;
    }

    subtract(n) {
        return this.add(this.fillTo9(n));
    }

    multiply(n) {
        let result = 0;

        for (let i = 1; i <= n; i += 1) {
            result = this.add(result);
        }

        return result;
    }

    divide(n) {
        //
    }
}

const n = new BCD(65536);
console.log(n.valueOf()); // 0b01100101010100110110 или 415030n
console.log(n.get(0)); // 6
console.log(n.get(1)); // 5

console.log(n.get(-1)); // 6
console.log(n.get(-2)); // 3
console.log(n.isNegative);

console.log(n.add(1));
console.log(n.subtract(1));
console.log(n.multiply(2)); 
// console.log(n.divide(2));
