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

    ee.addEventListener(event, callback);

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
        ee.removeEventListener(event, callback);
    }

    ee.addEventListener(event, callback);

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

function any(...iterators) {
    const promises = [];

    let result;

    const callback = async () => {
        const first = await Promise.race(iterators.map(i => i.next()));
        result = first.value;
        console.log(result);
        const p = promises.pop();
        p.resolve({odne: false, value: result});
    }
    
    callback();

    return {
        [Symbol.asyncIterator]() {
            return this;
        },
        next() {
            console.log('NEXT');
            const promise = withResolvers();
            promises.push(promise);
            return promise.promise;
        }
    }
}

(async () => {
    for await (const e of any(
        on(document.body, 'click'),
        on(document.querySelector('.search3__spacer'), 'mousemove')
    )) {
        console.log({event: e});
    }
})();

function anyD(...iterators) {
    const promises = [];

    let result;

    const callback = async () => {
        const first = await Promise.race(iterators.map(i => i.next()));
        result = first.value;
        console.log(result);
        const p = promises.pop();
        p.resolve({odne: false, value: result});
    }
    
    callback();

    result.target.addEventListener(result.type, callback);
    
    return {
        [Symbol.asyncIterator]() {
            return this;
        },
        next() {
            console.log('NEXT');
            const promise = withResolvers();
            promises.push(promise);
            return promise.promise;
        }
    }
}

// function any(...iterators) {
//     const promises = [];

//     const callback = async () => {
//         for await (const iteraror of iterators) {
//             for await (const value of iteraror) {
//                 const p = promises.pop();
//                 p.resolve({done: false, value});
//             }
//         }
//     }

//     callback();

//     return {
//         [Symbol.asyncIterator]() {
//             return this;
//         },
//         next() {
//             const promise = withResolvers();
//             promises.push(promise);

//             return promise.promise;
//         }
//     }
// }