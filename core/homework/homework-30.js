const {EventEmitter} = require('node:events');

// ## Необходимо написать функции on/once, которая бы принимала любой источник событий и событие и возвращала асинхронный итератор

const withResolvers = () => {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return {
        promise,
        reject,
        resolve,
    };
}

function on(ee, event) {
    const promises = [];

    const callback = value => {
        promises
            .splice(0, promises.length)
            .forEach(({resolve}) => {
                resolve({done: false, value});
            });
    }

    ee.on(event, callback);

    return {
        [Symbol.asyncIterator]() {
            return this;
        },
        
        next() {
            const promise = withResolvers();
            promises.push(promise);

            return promise.promise;
        },
    }
}

const ee = new EventEmitter();

(async () => {
    for await (const data of on(ee, 'foo')) {
        console.log(data);
    }
})();

// setTimeout(() => {
//     ee.emit('foo', 1);
// }, 1000);

function once(ee, event) {
    const promises = [];
    let done = false;

    const callback = value => {
        promises
            .splice(0, promises.length)
            .forEach(({resolve}) => {
                resolve({done: false, value});
            });

        done = true;
        ee.off(event, callback);
    }

    ee.on(event, callback);

    return {
        [Symbol.asyncIterator]() {
            return this;
        },
        
        next() {
            if (done) {
                return Promise.resolve({done, value: undefined});
            }

            const promise = withResolvers();
            promises.push(promise);

            return promise.promise;
        },
    }
}

const ee2 = new EventEmitter();

(async () => {
    for await (const data of once(ee2, 'foo')) {
        console.log(data);
    }
})();

// setTimeout(() => {
//     ee2.emit('foo', 1);
// }, 1000);

// setTimeout(() => {
//     ee2.emit('foo', 2);
// }, 500);

// ## Необходимо написать функции filter/map/seq/take из заданий по итераторам, чтобы они работали и с асинхронными итераторами

function take(iterable, limit) {
    const iterator = iterable[Symbol.asyncIterator]();

    return {
        [Symbol.asyncIterator]() {
            return this;
        },
        async next() {
            if (!limit) {
                return {done: true, value: undefined};
            }

            const current = await iterator.next();

            limit -= 1;
            return {done: false, value: current.value};
        }
    }
}

function filter(iterable, pred) {
    const iterator = iterable[Symbol.asyncIterator]();

    return {
        [Symbol.asyncIterator]() {
            return this;
        },
        async next() {
            let currentState = await iterator.next();

            if (currentState.done) {
                return {done: true, value: undefined};
            }

            while (!pred(currentState.value)) {
                currentState = await iterator.next();
            }

            return {done: false, value: currentState.value};
        }
    }
}

function map(iterable, pred) {
    const iterator = iterable[Symbol.asyncIterator]();

    return {
        [Symbol.asyncIterator]() {
            return this;
        },
        async next() {
            let currentState = await iterator.next();

            if (currentState.done) {
                return {done: true, value: undefined};
            }

            return {done: false, value: pred(currentState.value)};
        }
    }
}

function seq(...iterables) {
    const iterators = iterables.map(i => i[Symbol.asyncIterator]());
    let i = 0;

    return {
        [Symbol.asyncIterator]() {
            return this;
        },
        async next() {
            const currentState = await iterators[i].next();

            if (currentState.done && i === iterators.length - 1) {
                return {done: true, value: undefined};
            }

            if (currentState.done) {
                i += 1;
                const nextIterator = await iterators[i].next();
                return {done: false, value: nextIterator.value};
            }

            return {done: false, value: currentState.value};
        }
    }
}

// (async () => {
//     for await (const e of seq(once(document.body, 'mousedown'), take(on(document.body, 'mousemove'), 10))) {
//         console.log(e);
//     }
// })();