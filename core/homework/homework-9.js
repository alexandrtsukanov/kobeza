class ListNode {
    constructor(value, next = null, prev = null) {
        this.value = value;
        this.next = next;
        this.prev = prev;
    }
}

class Dequeue {
    constructor(typedArrayConstructor, capacity) {
        this.capacity = capacity;
        this.arrayLen = 7;
        this.typedArrayConstructor = typedArrayConstructor;

        const initialArray = new typedArrayConstructor(this.arrayLen);

        this.linkedList = new ListNode(initialArray);
        this.head = {array: initialArray, node: this.linkedList};
        this.tail = {array: initialArray, node: this.linkedList};

        this.length = 0;
    }

    pushRight(value) {
        this.checkSize();

        if (this.length === 0) {
            this.pushFirst(value);

        } else if (this.tail.index < this.arrayLen - 1) {
            const indexToInsert = this.tail.index + 1;
            this.tail.array[indexToInsert] = value;
            this.tail.index = indexToInsert;

        } else {
            if (!this.tail.node.next) {
                const nextNodeArray = new ListNode(new this.typedArrayConstructor(this.arrayLen));
                this.tail.node.next = nextNodeArray;
                nextNodeArray.prev = this.tail.node;
            }

            this.tail.array = this.tail.node.next.value;
            this.tail.array[0] = value;
            this.tail.node = this.tail.node.next;
            this.tail.index = 0;
        }

        this.length += 1;
        return this.length;
    }

    pushLeft(value) {
        this.checkSize();

        if (this.length === 0) {
            this.pushFirst(value);

        } else if (this.head.index !== 0) {
            const indexToInsert = this.head.index - 1;
            this.head.array[indexToInsert] = value;
            this.head.index = indexToInsert;

        } else {
            if (!this.head.node.prev) {
                const prevNodeArray = new ListNode(new this.typedArrayConstructor(this.arrayLen));
                this.head.node.prev = prevNodeArray;
                prevNodeArray.next = this.head.node;
            }

            this.head.array = this.head.node.prev.value;
            this.head.array[this.arrayLen - 1] = value;
            this.head.node = this.head.node.prev;
            this.head.index = this.arrayLen - 1;
        }

        this.length += 1;
        return this.length;
    }

    popRight() {
        const element = this.tail.array[this.tail.index];
        this.tail.array[this.tail.index] = 0;

        if (this.tail.index === 0) {
            this.tail.array = this.tail.node.prev.value;
            this.tail.node = this.tail.node.prev;
            this.tail.index = this.arrayLen - 1;
        } else {
            this.tail.index -= 1;
        }

        this.length -= 1;
        return element;
    }

    popLeft() {
        const element = this.head.array[this.head.index];
        this.head.array[this.head.index] = 0;

        if (this.head.index === this.arrayLen - 1) {
            this.head.array = this.head.node.next.value;
            this.head.node = this.head.node.next;
            this.head.index = 0;
        } else {
            this.head.index += 1;
        }

        this.length -= 1;
        return element;       
    }

    pushFirst(value) {
        const midIndex = Math.floor(this.arrayLen / 2);

        this.head.array[midIndex] = value;
        this.head.index = midIndex;

        this.tail.array[midIndex] = value;
        this.tail.index = midIndex;
    }

    checkSize() {
        if (this.length >= this.capacity) {
            throw new RangeError('Dequeue is complete');
        }
    }
}

const dequeue = new Dequeue(Uint8Array, 64);

// dequeue.pushLeft(1); // Возвращает длину - 1
// dequeue.pushLeft(2); // 2
// dequeue.pushLeft(3); // 3

// console.log(dequeue.length); // 3
// dequeue.popLeft();           // Удаляет с начала, возвращает удаленный элемент - 3
// console.log(dequeue.length); // 2

// dequeue.pushRight(4);
// dequeue.pushRight(5);
// dequeue.pushRight(6);
// dequeue.pushRight(7);
// dequeue.pushRight(8);
// dequeue.pushRight(9);
// dequeue.pushRight(10);

// dequeue.pushLeft(-1);
// dequeue.pushLeft(-2);
// dequeue.pushLeft(-3);
// dequeue.pushLeft(-4);

// dequeue.popRight();
// console.log(dequeue.tail); //
// console.log(dequeue.head); //

class Structure {
    constructor(data) {
        this.buffer = new ArrayBuffer(1024);
        this.data = data;
    }

    U8() {
        return (offset) => {
            if (!offset) {
                return;
            }

            const arr = new Uint8Array(this.buffer, offset, 1);
    
            return {
                get: () => arr[0],
                set: (value) => {
                    arr[0] = value;
                },
                getOffset: () => offset + 1,
            }
        }
    }

    U(bits) {
        if (bits > 64) {
            throw new RangeError('Amount of bits cannot exceed 64');
        }

        return (offset) => {
            if (!offset) {
                return;
            }

            const bytes = Math.ceil(bits / 8);
            const arr = new Uint8Array(this.buffer, offset, bytes);

            return {
                get: () => {
                    let result = 0;
                    let diff = 0;

                    for (let i = arr.length - 1; i >= 0; i -= 1) {
                        result |= (arr[i] << diff);
                        diff += 8;
                    }

                    return result;
                },

                set(value) {
                    let maskPos = 8 * bytes;

                    for (let i = 0; i < arr.length; i += 1) {
                        const mask = this.createMask(8, maskPos);
                        arr[i] = value & mask >>> (maskPos - 8);
                        maskPos -= 8;
                    };
                },

                getOffset: () => offset + bytes,
            };
        }
    }

    String(format) {
        return function string(offset, charsNum) {
            const bytes = charsNum * this.getStringEncodingData(format.toLowerCase());
            const arr = new Uint8Array(this.buffer, offset, bytes);

            return {
                get() {
                    let str = '';

                    if (bytes > 1) {
                        for (let i = 0; i < arr.length; i += 2) {
                            str += String.fromCharCode((arr[i * 2] << 8) | arr[i * 2 + 1]);
                        }
                    } else {
                        for (let i = 0; i < arr.length; i += 1) {
                            str += String.fromCharCode(arr[i]);
                        }
                    }

                    return str;                    
                },
                set(str) {
                    const maskFirst = this.createMask(8, 16);
                    const maskSecond = this.createMask(8, 8);

                    for (let i = 0; i < str.length; i += 1) {
                        const char = str[i];
                        const charCode = char.codePointAt(0);

                        if (bytes === 1) {
                            arr[i] = charCode;
                        } else {
                            arr[i * 2] = charCode & maskFirst >>> 8;
                            arr[i * 2 + 1] = charCode & maskSecond >>> 0;
                        }
                    };

                    return offset + bytes;
                },

                getOffset: () => offset + bytes,
            }
        }
    }

    Tuple(...methods) {
        const tuple = [];
        let offset = 0;

        for (const runner of methods) {
            const implementor = runner(
                offset,
                // string.length?
            )
            tuple.push(implementor.get());
            offset = implementor.getOffset();
        }

        return tuple;
    }

    create(data) {
        const entries = Object.entries(data);
        let offset = 0;

        for (const [key, value] of entries) {
            const runner = this.data[key];
            const implementor = runner(
                offset,
                typeof value === 'string' ? value.length : undefined,
            );
            implementor.set(value);
            offset = implementor.getOffset();
        }
    }

    createMask(len, pos) {
        let r = ~0;
        r <<= 32 - len;
        r >>>= 32 - pos;
        return r;
    }

    getStringEncodingData(format) {
        if (format === 'ascii' || format === 'utf-8') {
            return 1;
        } else {
            return 2;
        }
    }
}