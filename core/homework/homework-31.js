function forEach1(iterable, callback) {
    const iterator = iterable[Symbol.iterator]();
    let current = iterator.next();

    while (!current.done) {
        const value = current.value;
        callback(value)
        current = iterator.next();
    }
}

let total = 0;

forEach1(new Array(50e9), () => {
    total++;
});

console.log(total);