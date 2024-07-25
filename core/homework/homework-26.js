class Result {
    constructor(callback) {
        this.state;
        this.reason;
        this.data;

        const call = (...args) => {
            try {
                const returned = callback(...args);

                this.state = 'ok';
                this.data = returned;
                this.reason = null;
            } catch(err) {
                this.state = 'error';
                this.reason = err;
                this.data = null;
            }
        }

        call();
    }

    then(cb) {
        if (this.state === 'ok') {
            cb(this.data);
        }

        return this;
    };

    catch(cb) {
        if (this.state === 'error') {
            cb(this.reason);
        }

        return this;
    };
}

const res1 = new Result(() => 42);

res1.then((data) => {
    console.log(data);
});

const res2 = new Result(() => { throw 'Boom!'; });

res2.then((data) => {
    // Этот callback не вызовется
    console.log(data);

// А этот вызовется
}).catch(console.error);

function exec(gen) {
    const iterator = gen();
    let currentState = iterator.next();
    let currentData = null;

    while (true) {
        if (currentState.done) {
            return currentData;
        }

        result = currentState.value;

        result
            .then(data => currentData = data)
            .catch(err => {
                iterator.throw(err);
                currentData = err;
            });

        currentState = iterator.next();
    }
}

// exec(function* main() {
//     const res1 = new Result(() => 42);
//     console.log(yield res1);
  
//     try {
//         const res2 = yield new Result(() => { throw 'Boom!'; });
  
//     } catch (err) {
//         console.error(err);
//     }

//     const res3 = yield new Result(() => 'Ok');
//     console.log(res3);
// });