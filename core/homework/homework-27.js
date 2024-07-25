class Result {
    constructor(callback) {
        this.state;
        this.reason;
        this.value;

        const call = (...args) => {
            try {
                const returned = callback(...args);

                this.state = 'ok';
                this.value = returned;
                this.reason = null;
            } catch(err) {
                this.state = 'error';
                this.reason = err;
                this.value = null;
            }
        }

        call();
    };

    Ok(value) {
        this.value = value;
        this.state = 'ok';
        this.reason = null;
       
        return this;
    };

    Error(error) {
        this.reason = error;
        this.state = 'error';
        this.value = null;

        return this;
    };

    then(cb) {
        if (this.state === 'ok') {
            cb(this.value);
        }

        return this;
    };

    catch(cb) {
        if (this.state === 'error') {
            cb(this.reason);
        }

        return this;
    };

    resolve(value) {
        if (value instanceof Result) return value;

        return new Result(() => value);
    };

    // Monad
    flatMap(callback) {
        const currentResult = this.resolve(callback(this.value));
        let result;

        currentResult
            .then(value => {
                result = new Result(() => value);
            })
            .catch(error => {
                result = new Result(() => {}).Error(error);
            })
    
        return result;
    };

    // Functor
    map(callback) {
        return new Result(() => callback(this.value));
    };
}

const res = new Result(() => 42);

// console.log(
//     res.flatMap((value) => new Result(() => value).Error('Boom')).catch(console.error)
//         .then(a => console.log('No error', a))
//         .catch(e => console.log('Error', e))
// );

// console.log(
//     res.flatMap((value) => new Result(() => value))
//         .then(a => console.log('No error', a))
//         .catch(e => console.log('Error', e))
// );

// console.log(
//     res.flatMap((value) => value * 2)
//         .then(a => console.log('No error', a))
//         .catch(e => console.log('Error', e))
// );

const res2 = new Result(() => 42);

// res2.map((value) => value * 10).then(console.log); //420

Function.prototype.map = function(callback) {
    const toCall = (...args) => callback(args);
    const returned = toCall();

    return () => this.call(this, returned);
}

// console.log(((v) => v * 10).map(() => 42)()); // 420
