const {EventEmitter} = require('node:events');

function on(emitter, event) {
    const promises = [];
    let done = false;
    
    const handler = (data) => {
        promises
            .splice(0, promises.length)
            .forEach(({resolve}) => {
                resolve({done: false, value: data});
            });
    }

    emitter.on(event, handler);

    return {
        [Symbol.asyncIterator]() {
            return this;
        },

        next() {
            if (done) {
                return Promise.resolve({done, value: undefined});               
            }

            const promise = Promise.withResolvers();
            promises.push(promise);

            return promise.promise;
        },

        return() {
            done = true;
            emitter.off(event, handler);
            return Promise.resolve({done, value: undefined});
        }
    }
}

const ee = new EventEmitter();

async function* enumerate(iterable) {
    let i = 0;

    for await (const data of iterable) {
        yield [i++, data];
    }
}

async function* filter(iterable, pred) {
    for await (const data of iterable) {
        if (pred(data)) {
            yield data
        }
    }
}

(async () => {
    for await (const data of on(ee, 'bla')) {
        console.log(data);
    }
})();

setTimeout(() => {
    ee.emit('bla', 1)
}, 100);

setTimeout(() => {
    ee.emit('bla', 2)
}, 50);

setTimeout(() => {
    ee.emit('bla', 3)
}, 250); 