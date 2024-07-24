function debounce(cb, ms) {
    let timeout;

    return function() {
        const innerCb = () => cb.apply(this, arguments);
        clearTimeout(timeout);
        timeout = setTimeout(innerCb, ms);
    }
}

function laugh() {
    console.log('Ha-ha!')
}

const debouncedLaugh = debounce(laugh, 3000);

// debouncedLaugh();
// debouncedLaugh();
// debouncedLaugh();
// debouncedLaugh();
// debouncedLaugh(); // Выполнится через 300 мс

function throttle(cb, ms) {
    let isThrottled = false;
    let args;
    let context;

    function inner() {
        if (isThrottled) {
            args = arguments;
            context = this;
            return;
        }

        cb.apply(this, arguments);

        isThrottled = true;

        setTimeout(() => {
            isThrottled = false;

            if (args && context) {
                inner.apply(args, context);
                args = undefined;
                context = undefined;
            }
        }, ms);
    }

    return inner;
}

function laugh2() {
    console.log('Ha-ha!')
}
  
const throttledLaugh = throttle(laugh2, 3000);
  
// throttledLaugh(); // Выполнится сразу
// throttledLaugh();
// throttledLaugh();
// throttledLaugh();
// throttledLaugh(); // Выполнится через 300 мс

class EventEmitter {
    constructor() {
        this.callbacks = new Map();
    };

    on(event, cb) {
        if (!this.callbacks.has(event)) {
            this.callbacks.set(event, new Set());
        }
        
        this.callbacks.get(event).add(cb);
    };

    off(event, cb) {
        if (!this.callbacks.has(event)) {
            return;
        }

        if (cb) {
            this.callbacks.get(event).delete(cb);
        } else {
            this.callbacks.get(event).clear();
        }
    };

    emit(event, ...args) {
        if (!this.callbacks.has(event)) {
            return;
        }
        
        this.callbacks.get(event).forEach(cb => cb(...args));
    };

    once(event, cb) {
        if (!this.callbacks.has(event)) {
            return;
        }

        const callbacks = this.callbacks.get(event);

        const toCall = (...args) => {
            cb(...args)
        };

        toCall();

        if (callbacks.has(cb)) {
            this.off(event, cb);
        };
    };
}

const ee = new EventEmitter();

// const f1 = () => {console.log(1)}
// const f2 = () => {console.log(2)}
// const f3 = () => {console.log(3)}
// const f4 = () => {console.log(4)}
// const f5 = () => {console.log(5)}

// ee.on('foo', f1);
// ee.on('foo', f2);
// ee.on('bar', f3);
// ee.on('bar', f4);
// ee.on('bar', f5);

// ee.off('bar', f5);
// ee.off('bar', f3);

// ee.emit('foo');
// ee.emit('bar');

// ee.once('foo', f2);
// ee.emit('foo');

function waterfall(iterable, finalCb) {
    let error = null;
    let prevArgs = [];

    const iterator = iterable[Symbol.iterator]();

    const innerCb = (err, ...args) => {
        if (err) {
            finalCb(err);
            error = err;
            return;
        }

        prevArgs = args;
    }

    while (true) {
        if (error) return;

        const currentState = iterator.next();
        
        if (currentState.done) {
            finalCb(null, ...prevArgs);
            return;
        }

        currentState.value(...prevArgs, innerCb);
    }
}

// waterfall([
//     (cb) => {
//         cb(null, 'one', 'two');
//     },
  
//     (arg1, arg2, cb) => {
//         console.log(arg1); // one
//         console.log(arg2); // two
//         cb(null, 'three');
//     },
  
//     (arg1, cb) => {
//         console.log(arg1); // three
//         cb(null, 'done');
//     }
// ], (err, result) => {
//     console.log(result); // done
// });
  
// waterfall(new Set([
//     (cb) => {
//         cb('ha-ha!');
//     },
  
//     (arg1, cb) => {
//         cb(null, 'done');
//     }
// ]), (err, result) => {
//     console.log(err);    // ha-ha!
//     console.log(result); // undefined
// });