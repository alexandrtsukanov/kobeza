let result

// fetch('someurl')
//     .then(response => response.json())
//     .then(data => result = data)

const a = [1, 2];

console.log(a.flatMap(a => [a, a]));
console.log(a.flatMap(a => a));
console.log(a.flatMap(a => console.log(a)));

console.log(a.map(a => [a, a]));
console.log(a.map(a => a));
console.log(a.map(a => console.log(a)));

class Lazy {
    constructor(executor) {
        this.executor = executor;
        this.value = undefined;
        this.state = 0;
    }

    getValue() {
        if (this.state === 0) {
            this.value = this.executor();
            this.state = 1;
        }

        return this.value;
    }

    // Monad: (param) => Lazy(() => param) | param
    then(f) {
        return new Lazy(() => this.resolve(f(this.getValue())).getValue());
    }

    // Functor: (param) => newParam
    map(f) {
        return new Lazy(() => f(this.getValue()));
    }

    resolve(a) {
        if (a instanceof Lazy) return a;
        return new Lazy(() => a)
    }
}

const lazy = new Lazy(() => {
    const arr = [];

    for (let i = 0; i < 10; i += 1) {
        arr.push(i);
    }

    return arr;
});

console.log(
    lazy
        .then(a => {
            return [a, a];
        })
        .then(a => {
            return [a, a];
        })
        .getValue()
);

const sum = lazy.map(el => el.reduce((acc, curr) => acc + curr, 0))

console.log(sum.getValue());
