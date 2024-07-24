function* gen() {
    yield 1;
    console.log(yield);
}

const iter = gen();

console.log(iter.next());
console.log(iter.next());
console.log(iter.next(4));
console.log(iter.next());

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

console.log(iter3.next());
console.log(iter3.next());
console.log(iter3.next());

function* gen4() {
    yield 1;
    yield 2;
    yield 3;
}

const iter4 = gen4();

console.log(iter4.next());
console.log(iter4.next());
console.log(iter4.return(10));
console.log(iter4.next());

function* gen5() {
    let input = yield;

    while (true) {
        for (const char of input) {
            console.log(char);
        }
    }
}

const iter5 = gen5();

console.log(iter5.next());
// console.log(iter5.next('def'));

