function curry(fn) {
    return function innerCurry(...args) {
        const filteredArgs = args.filter(arg => arg !== undefined);

        if (filteredArgs.length === fn.length) {
            return fn(...filteredArgs);
        } else {
            return (...args2) => {
                return innerCurry(...args2, ...filteredArgs);
            }
        }
    }
}

const diff = curry((a, b) => a - b);

// console.log(diff(curry._, 10)(15)); // 5// 1 - 10 - 3 - 2

// Более читаемо
function compose(...functions) {
    return value => {
        return functions
            .reverse()
            .reduce((result, fn) => fn(result), value)
    }
}

// Более старомодно, но один линейный проход
function compose2(...functions) {
    return value => {
        let result = value;

        for (let i = functions.length - 1; i >= 0; i -= 1) {
            result = functions[i](result);
        }

        return result;
    }
}

const f = compose(
    (a) => a ** 2,
    (a) => a * 10,
    (a) => Math.sqrt(a) // Первая
);
  
// console.log(f(16)); // 1600