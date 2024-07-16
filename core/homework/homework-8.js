// Vector

class Vector {
    constructor(typedArrayConstructor, options) {
        const {capacity} = options;

        this.typedArrayConstructor = typedArrayConstructor;
        this.capacity = capacity;
        this.length = 0;
        this.array = new typedArrayConstructor(capacity);
        this.cursor = 0; // For iterator
    }

    push(value) {
        if (this.length >= this.capacity) {
            const oldArray = this.array;
            const newCapacity = this.capacity * 2;
            this.array = new this.typedArrayConstructor(newCapacity);
            this.capacity = newCapacity;

            for (let i = 0; i < oldArray.length; i += 1) {
                this.array[i] = oldArray[i];
            }
        }

        this.array[this.length] = value;
        this.length += 1;

        return this.length;
    }

    pop() {
        if (!this.length) {
            return;
        }

        const element = this.array[this.length - 1];
        this.array[this.length - 1] = 0;
        this.length -= 1;

        return element;
    }

    shrinkToFit() {
        if (this.capacity / this.length < 2) {
            return;
        }

        const oldArray = this.array;
        const newCapacity = this.capacity / 2;
        this.array = new this.typedArrayConstructor(newCapacity);
        this.capacity = newCapacity;

        for (let i = 0; i < oldArray.length / 2; i += 1) {
            this.array[i] = oldArray[i];
        }
    }

    get buffer() {
        return this.array.buffer;
    }

    values() {
        return {
            [Symbol.iterator]() {
                return this;
            },

            next: () => {
                if (this.cursor >= this.length) {
                    return {done: true, value: undefined};
                }
                
                const currentCursor = this.cursor;
                this.cursor += 1;

                return {done: false, value: this.array[currentCursor]};
            }
        }
    }
}

const vec = new Vector(Uint32Array, {capacity: 4});

// console.log(vec.push(1)); // 1
// console.log(vec.push(2)); // 2
// console.log(vec.push(3)); // 3
// console.log(vec.push(4)); // 4
// console.log(vec.push(5)); // 5
// console.log(console.log(vec.array));

// console.log(vec.pop()); // 5

// console.log(vec.capacity); // 8

// vec.shrinkToFit();

// console.log(console.log(vec.array));
// console.log(console.log(vec.capacity)); // 4
// console.log(console.log(vec.buffer));

const i = vec.values();

// console.log(i.next()); // {done: false, value: 1}
// console.log(i.next()); // {done: false, value: 2}
// console.log(i.next()); // {done: false, value: 3}
// console.log(i.next()); // {done: true, value: undefined}
// console.log(i.next()); // {done: false, value: 3}
// console.log(i.next()); // {done: true, value: undefined}

// Matrix

class Matrix {
    constructor(typedArrayConstructor, ...dimensions) {
        this.dimensions = dimensions;
        this.capacity = this.dimensions.reduce((acc, curr) => acc * curr, 1);
        this.array = new typedArrayConstructor(this.capacity);
        this.totalLength = 0;
        this.cursor = 0; // For iterator
    }

    get(...coords) {
        const index = this.getIndex(...coords);

        this.checkCoords(index);

        return this.array[index];
    }

    set(...args) {
        const value = args[args.length - 1];
        const coords = args.slice(0, args.length - 1);
        const index = this.getIndex(...coords);

        this.checkCoords(index);

        this.array[index] = value;
        this.totalLength += 1;
    }

    getIndex(...coords) {
        let index = 0;
        let product = 1;

        for (let i = this.dimensions.length - 1; i >= 0; i -= 1) {
            index += coords[i] * product;
            product *= this.dimensions[i];
        }

        return index;
    }

    get buffer() {
        return this.array.buffer;
    }

    checkCoords(index) {
        if (index >= this.capacity) {
            throw new Error('Invalid coordinates');
        }
    }

    values() {
        return {
            [Symbol.iterator]() {
                return this;
            },

            next: () => {
                if (this.cursor >= this.totalLength) {
                    return {done: true, value: undefined};
                }

                return {done: false, value: this.array[this.cursor++]};
            }
        }
    }

}

const matrix3n4n5 = new Matrix(Int32Array, 2, 2, 2);

// matrix3n4n5.set(0, 0, 0, 1);
// matrix3n4n5.set(0, 1, 0, 2);
// matrix3n4n5.set(0, 0, 1, 3);
// matrix3n4n5.set(0, 1, 1, 4);

// matrix3n4n5.set(1, 0, 0, 5);
// matrix3n4n5.set(1, 1, 0, 6);
// matrix3n4n5.set(1, 0, 1, 7);
// matrix3n4n5.set(1, 1, 1, 8);

// matrix3n4n5.get(0, 0, 0); // 1
// matrix3n4n5.get(0, 1, 0); // 2
// matrix3n4n5.get(0, 0, 1); // 3
// matrix3n4n5.get(0, 1, 1); // 4

// matrix3n4n5.get(1, 0, 0); // 5
// matrix3n4n5.get(1, 1, 0); // 6
// matrix3n4n5.get(1, 0, 1); // 7
// matrix3n4n5.get(1, 1, 1); // 8

// console.log(Array.from(matrix3n4n5.values()));
