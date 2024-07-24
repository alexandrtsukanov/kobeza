// ## Необходимо КА, который считывает дробные числа из потока входных данных
// Если поток данных иссяк, то КА должен выбрасывать исключение и переходить в состояние ожидания новых данных.

function* getNumbers(text) {
    const STATES = {
        SYMBOL: 'symbol', // default
        DIGIT: 'digit',
        DOT: 'dot',
        FLOAT: 'float',
    }

    let input = text;

    const isDigit = char => new RegExp('\\d').test(char);
    const isDot = char => char === '.';

    const getInitialState = str => {
        if (!str) return STATES.SYMBOL;
        if (isDigit(str[0])) return STATES.DIGIT;
        if (isDot(str[0])) return STATES.DOT;
        return STATES.SYMBOL;
    }

    let state = getInitialState(input);
    let start = 0;
    let lastDotIndex = 0;
    let substr = '';

    while (true) {
        try {
            for (let i = 0; i < input.length; i += 1) {
                if (state === STATES.FLOAT && !isDigit(input[i])) {
                    if (substr) {
                        yield substr + input.slice(0, i);
                        substr = substr.slice(substr.lastIndexOf('.') + 1);
                    } else {
                        yield input.slice(start, i);
                    }

                    if (isDot(input[i])) {
                        state = STATES.DOT;
                        start = lastDotIndex + 1;
                    } else {
                        state = STATES.SYMBOL;
                        start = i;
                        substr = '';
                    }

                    continue;
                }

                if (state === STATES.SYMBOL && isDigit(input[i])) {
                    state = STATES.DIGIT;
                    start = i;
                    continue;
                }

                if (state === STATES.DIGIT) {
                    if (isDot(input[i])) {
                        state = STATES.DOT;
                        lastDotIndex = i;
                    } else if (!isDigit(input[i])) {
                        state = STATES.SYMBOL;
                        substr = '';
                        start = i;
                    }
    
                    continue;
                }

                if (state === STATES.DOT && isDigit(input[i])) {
                    state = STATES.FLOAT;
                    continue;
                }
            }

            if (!input.length) throw new Error('Expect new input');

            if (state !== STATES.SYMBOL) {
                substr = input.slice(start, input.length);
            }

            throw new Error('Expect new input');
        } catch(e) {
            input = yield;
        }
    }
}

const someString = 'a244.41.5bcd';
const newString = 'abc3';

// const numbers = getNumbers(someString);

// console.log(numbers.next());
// console.log(numbers.next());
// console.log(numbers.next());
// console.log(numbers.next(newString));
// console.log(numbers.next());
// console.log(numbers.next('.5a1.2b'));
// console.log(numbers.next());

// const numbers = getNumbers('1.23');

// console.log(numbers.next());
// console.log(numbers.next());
// console.log(numbers.next());
// console.log(numbers.next());
// console.log(numbers.next('4.5a1.2b'));
// console.log(numbers.next());
// console.log(numbers.next());


// ## Необходимо реализовать набор итераторов по DOM дереву

// Должны быть реализованы итераторы для обхода: "вверх по иерархии узлов", "обход сестринских узлов", "обход всех потомков".
// Для тестирования в среде Node.js можно использовать библиотеку https://www.npmjs.com/package/jsdom.
// Итераторы должны быть написаны как С, так и без помощи генераторов.

// console.log(...siblings(myNode));
// console.log(...ancestors(myNode));
// console.log(...descendants(myNode));

function siblingsIterator(node) {
    const parent = node.parentNode;
    const children = parent.childNodes;
    let i = 0;

    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            if (i === children.length - 1) {
                return {done: true, value: undefined};
            }

            while (children[i].isEqualNode(node)) {
                i += 1;
            }

            return {done: false, value: children[i++]}
        },
    }
}

function* siblingsGenerator(node) {
    const parent = node.parentNode;
    const children = parent.childNodes;

    for (const childNode of children) {
        if (childNode.isEqualNode(node)) {
            continue;
        }

        yield childNode;
    }
}

function ancestorsIterator(node) {
    return {
        [Symbol.iterator]() {
            return this;
        },
        next() {
            if (node === null) {
                return {done: true, value: undefined};
            }

            const saved = node;
            node = node.parentNode;

            return {done: false, value: saved};
        },
    }
}

function* ancestorsGenerator(node) {
    while (node !== null) {
        yield node;
        node = node.parentNode;;
    }
}

function* descendantsGenerator(node) {
    const children = node.childNodes;

    for (const childNode of children) {
        yield childNode;
        yield* childNode.childNodes;
    }
}