// Array recursive iteration
function forEach(array, callback, i = 0) {
    if (i >= array.length) {
        return;
    }
    callback(array[i]);
    forEach(array, callback, i + 1);
}

const a1 = [1,2,3,4,5];
// forEach(a1, console.log)

// Linked list iteration by for loop
const ll = {
    value: 1,
    next: {
        value: 2,
        next: {
            value: 3,
            next: null,
        },
    },
}
for (let i = ll; i !== null; i = i.next) {
    // console.log(i.value);
}

const a2 = [1,2,3,4,5];
// a2.forEach(console.log)
// a2.forEach(el => console.log(el))


// Universal iterator for arrays
function arrayForEach(arr) {
    let i = 0;

    return {
        next() {
            const done = i >= arr.length;

            if (done) {
                return {value: undefined, done};
            }

            return {value: arr[i++], done};
        }
    }
}

const a3 = [1,2,3,4];

for (let o = arrayForEach(a3), i = o.next(); !i.done; i = o.next()) {
    // console.log(i.value);
}

// Universal iterator for linked lists
function arrayForLinkedList(ll) {
    let i = ll;

    return {
        next() {
            const done = i === null;

            if (done) {
                return {value: undefined, done};
            }

            const current = i;
            i = i.next;
            
            return {value: current.value, done};
        }
    }
}

const ll2 = {value: 1, next: {value: 2, next: null}};

for (let o = arrayForLinkedList(ll2), i = o.next(); !i.done; i = o.next()) {
    // console.log(i.value);
}

// Universal iterator for reversed arrays
function arrayReversedForEach(arr) {
    let i = arr.length;

    return {
        next() {
            const done = i < 0;

            if (done) {
                return {value: undefined, done};
            }

            return {value: arr[i--], done};
        }
    }
}

logger(arrayOddForEach(a3));

function logger(iterator) {
    for (let i = iterator.next(); !i.done; i = iterator.next()) {
        console.log(i.value);
    }
}

// Universal iterator for arrays, odd indexes
function arrayOddForEach(arr) {
    let i = 0;

    return {
        next() {
            if (i % 2 === 0) {
                i += 1;
            }

            const done = i >= arr.length;

            if (done) {
                return {value: undefined, done};
            }

            return {value: arr[i++], done};
        }
    }
}

var a4 = [2,3,4,5]
console.log(a4
    [Symbol.iterator]()
    .next()
)

var a5 = [1,2,3,4,5];
console.log(a5[Symbol.iterator]())