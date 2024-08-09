// ## Необходимо написать функцию sleep, которая бы принимала заданное количество миллисекунд и возвращала Promise

function sleep(ms) {
    return new Promise((res, _) => {
        setTimeout(() => {
            res();
        }, ms)
    })
}

sleep(1000).then(() => {
    console.log(`I'am awake!`);
});

// ## Необходимо написать функцию timeout, которая бы принимала Promise и заданное количество миллисекунд и возвращала Promise

function timeout(promise, ms) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            promise
                .then(data => res(data))
                .catch(err => rej(err))
        }, ms)
    })
}

timeout(Promise.reject('Error').catch(err => err), 2000).then(console.log).catch(console.error);

// ## Необходимо написать функцию setImmediate/clearImmediate по аналогии с node.js

const queue = new Array(16);
let i = Math.floor(Math.random() * (queue.length - 1 - 0 + 1) + 0);

for (let j = 0; j < i; j += 1) {
    queue[j] = () => Math.random();
}

function setImmediate(callback) {
    let start = 0;

    while (start < i) {
        queue[start++]();
    }

    queue[start] = callback;
    return setTimeout(queue[start], 0);
}

function clearImmediate(immediate) {
    if (!immediate) return;

    clearTimeout(immediate);
}

// ## Необходимо написать функцию promisify, которая бы принимала функцию, где последний аргумент callback и возвращала бы новую функцию
// Новая функция вместо callback будет возвращать Promise.

function promisify(fn) {
    return (...args) => {
        return new Promise((res, rej) => {
            const cb = (err, result) => {
                if (err) {
                    rej(err);
                } 

                res(result);
            };
            
            fn(...args, cb);
        })
    }
}

function readFile(file, cb) {
    cb(null, 'fileContent');
}

const readFilePromise = promisify(readFile);
readFilePromise('my-file.txt').then(console.log).catch(console.error);

// ## Необходимо написать класс SyncPromise, аналогичный нативному, но работающий синхронно, если это возможно

class SyncPromise {
    constructor(callback) {
        this.value = undefined;
        this.reason = undefined;
        this.state = 'init'; // init | fulfilled | rejected

        try {
            callback(this.resolve, this.reject);
        } catch(err) {
            this.reject(err);
        }
    };

    resolve(value) {
        this.state = 'fulfilled';
        this.value = value;
        
        return this;
    };

    reject(err) {
        this.state = 'rejected';
        this.reason = err;

        return this;
    };

    then(cb) {
        if (this.state === 'fulfilled') {
            try {
                this.value = cb(this.value);
            } catch(err) {
                this.reject(err);
            }
        }

        return this;
    };

    catch(cb) {
        if (this.state === 'rejected') {
            this.reason = cb(this.reason);
        }

        this.state = 'fulfilled'
        this.value = undefined;
        return this;
    };

    finally(cb) {
        cb(this.value);
    }
}

const sp = new SyncPromise();

sp.resolve(1).then(console.log); // 1
console.log(2);                  // 2

// ## Необходимо написать функцию allLimit, которая бы принимала Iterable функций, возвращающих Promise (или обычные значения) и лимит одновременных Promise
// Одновременно не должно быть более заданного числа Promise в Pending.

function Inspector() {
    const arr = [];
 
    this.add = function(p, label) {
        p.label = label || '';
 
        if (!p.state) {
            p.state = 'pending';
            p.then(() => p.state = 'resolved').catch(() => p.state = 'rejected');
        }
 
       arr.push(p);

       return p;
    };
 
    this.getPending = function() {
        return arr.filter(p => p.state === 'pending');
    };
}

function allLimit(functions, limit) {
    const inspector = new Inspector();

    for (let i = 0; i < functions.length; i += 1) {
        const fn = functions[i];
        const result = fn();

        if (result instanceof Promise) {
            inspector.add(result, i);
        }
    }

    const pendingPromises = inspector.getPending();
    
    return new Promise((res, _) => {
        const output = [];

        let pos = 0;

        while (limit) {
            const pendingPromise = pendingPromises[pos];
            output.push(pendingPromise);
            pos += 1;
            limit -= 1;
        }

        res(output);
    })
}