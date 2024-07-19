// ## Необходимо написать итератор для генерации случайных чисел по заданным параметрам

function random(min, max) {
    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            return {done: false, value: Math.floor(Math.random() * (max - min + 1) + min)}
        }
    };
}

const randomInt = random(0, 100);

console.log(randomInt.next());
console.log(randomInt.next());
console.log(randomInt.next());
console.log(randomInt.next());


// ## Необходимо написать функцию take, которая принимает любой Iterable объект и возвращает итератор по заданному количеству его элементов

function take(iterable, limit) {
    const iterator = iterable[Symbol.iterator]();
    let i = limit;

    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            while (i) {
                i -= 1;
                return {done: false, value: iterator.next().value};
            }

            return {done: true, value: undefined};
        }
    }
}

console.log([...take(randomInt, 5)])


// ## Необходимо написать функцию filter, которая принимает любой Iterable объект и функцию-предикат. И возвращает итератор по элементам которые удовлетворяют предикату.

function filter(iterable, callback) {
    const iterator = iterable[Symbol.iterator]();

    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            let currentValue = iterator.next().value;

            while (!callback(currentValue)) {
                currentValue = iterator.next().value;
            }

            return {done: false, value: currentValue};
        }
    }
}

console.log([...take(filter(randomInt, (el) => el > 30), 15)]);


// ## Необходимо написать функцию enumerate, которая принимает любой Iterable объект и возвращает итератор по парам (номер итерации, элемент)

function enumerate(iterable) {
    const iterator = iterable[Symbol.iterator]();
    let i = 0;

    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            if (iterator.next().done) {
                return {done: true, value: undefined};
            }

            return {
                done: false,
                value: [i++, iterator.next().value],
            }
        }
    }
}

console.log([...take(enumerate(randomInt), 5)]); // [[0, ...], [1, ...], [2, ...]]


// ## Необходимо написать класс Range, который бы позволял создавать диапазоны чисел или символов, а также позволял обходить элементы Range с любого конца

class Range {
    constructor(from, to) {
        this.validate(from, to);
        this.from = from;
        this.to = to;
        this.type = typeof this.from;
    }

    [Symbol.iterator]() {
        let current = this.from;

        return {
            next: () => {
                if (current > this.to) {
                    return {done: true, value: undefined};
                }

                const saved = current;

                switch (this.type) {
                    case 'number':
                        current += 1;
                        break;
                    case 'string':
                        current = String.fromCharCode(current.charCodeAt(0) + 1);
                        break;
                }
                
                return {done: false, value: saved};
            }
        }
    }

    reverse() {
        return {
            [Symbol.iterator]: () => {
                let current = this.to;

                return {
                    next: () => {
                        if (current < this.from) {
                            return {done: true, value: undefined};
                        }

                        const saved = current;
        
                        switch (this.type) {
                            case 'number':
                                current -= 1;
                                break;
                            case 'string':
                                current = String.fromCharCode(current.charCodeAt(0) - 1);
                                break;
                        }
                        
                        return {done: false, value: saved};
                    }
                }
            }
        }
    }

    validate(from, to) {
        if (
            (
                !['number', 'string'].includes(typeof from) || 
                !['number', 'string'].includes(typeof to)
            ) ||
            (
                (typeof from === 'string' && from.length > 1) ||
                (typeof to === 'string' && to.length > 1)    
            ) || 
            (
                (typeof from === 'string' && !new RegExp('[A-Za-zА-ЯЁа-яё]').test(from)) ||
                (typeof to === 'string' && !new RegExp('[A-Za-zА-ЯЁа-яё]').test(to))    
            )
        ) {
            throw new TypeError('Only numbers or letters expected');
        }

        if (
            (typeof from === 'number' && typeof to !== 'number') || 
            (typeof from === 'string' && typeof to !== 'string')
        ) {
            throw new TypeError('Params from and to must be have the same type');
        }

        if (from > to) {
            throw new Error('From param cannot be greater than to param');
        }
    }
}

const symbolRange = new Range('a', 'f');

console.log(Array.from(symbolRange)); // ['a', 'b', 'c', 'd', 'e', 'f']

const numberRange = new Range(-5, 1);

console.log(Array.from(numberRange.reverse())); // [1, 0, -1, -2, -3, -4, -5]


// ## Необходимо написать функцию seq, которая бы принимала множество Iterable объектов и возвращала итератор по их элементам

function seq(iterables) {

}

// console.log(...seq([1, 2], new Set([3, 4]), 'bla')); // 1, 2, 3, 4, 'b', 'l', 'a'
