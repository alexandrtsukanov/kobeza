function* gen() {
    yield 1;
    console.log(yield);
}

const iter = gen();

console.log(1, iter.next());
console.log(1, iter.next());
console.log(1, iter.next(4));
console.log(1, iter.next());

function* gen2() {
    yield 1;
    yield 2;
    yield 3;
}

const iter2 = gen2();
// console.log(iter2.next());
// console.log(iter2.next());
// console.log(iter2.next());
// console.log(iter2.next());

console.log(...iter2);

function* gen3() {
    yield 1;
    return 2;
}

const iter3 = gen3();

console.log(3, iter3.next());
console.log(3, iter3.next());
console.log(3, iter3.next());

function* gen4() {
    yield 1;
    yield 2;
    yield 3;
}

const iter4 = gen4();

console.log(4, iter4.next());
console.log(4, iter4.next());
console.log(4, iter4.return(10));
console.log(4, iter4.next());

function* gen5() {
    let input = yield;

    while (true) {
        for (const char of input) {
            console.log(char);
        }
    }
}

const iter5 = gen5();

console.log(5, iter5.next());
// console.log(iter5.next('def'));

function* gen6(data) {
    while (true) {
        for (const char of data) {
            console.log(char);
        }

        data = yield 'Expect data';
    }
}

const iter6 = gen6('abcdef');

console.log(6, iter6.next()); // value - 'Expect data'
// console.log(6, iter5.next('ghi')); // data = ghi
