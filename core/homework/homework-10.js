class Pointer {
    constructor(start, length, buffer) {
        this.start = start;
        this.length = length;
        this.buffer = buffer;
    }

    change(newBuffer) {
        const bufferArr = new Uint8Array(newBuffer);
        const arr = new Uint8Array(this.buffer);

        if (this.length !== bufferArr.byteLength) {
            throw new Error('New data size and current data size are different');
        }

        for (let i = this.start; i < this.start + this.length; i += 1) {
            arr[i] = bufferArr[i];
        }
    }
}

class StackPointer extends Pointer {
    constructor(start, length, buffer) {
        super(start, length, buffer);
    }

    deref() {
        return new Uint8Array(this.buffer, this.start, this.length).buffer;
    }
}

class HeapPointer extends Pointer {
    constructor(start, length, buffer) {
        super(start, length, buffer);
    }

    free() {
        const arr = new Uint8Array(this.buffer);

        for (let i = this.start; i < this.start + this.length; i += 1) {
            arr[i] = 0;
        }
    }
}

class Memory {
    constructor(size, stackData) {
        this.buffer = new ArrayBuffer(size);
        this.stackSize = stackData.stack;
        this.heapSize = size - this.stackSize;
        this.stackTail = 0;
        this.heapTail = this.stackSize;
        this.lastPointerInStack = null;
    }

    // Stack methods
    push(buffer) {
        this.checkStackSize(buffer);

        const arr = new Uint8Array(this.buffer);
        const bufferArr = new Uint8Array(buffer);

        let pos = this.stackTail;
        let len = 0;

        for (let i = this.stackTail; i < this.stackTail + bufferArr.byteLength; i += 1) {
            arr[i] = bufferArr[i];
            pos += 1;
            len += 1;
        }

        const start = this.stackTail;
        this.stackTail = pos;
        const pointer = new StackPointer(start, len, this.buffer);
        this.lastPointerInStack = pointer;

        return pointer;
    }

    pop() {
        this.checkIfStackIsEmpty();

        const arr = new Uint8Array(this.buffer);

        for (let i = this.stackTail - 1; i > this.stackTail - 1 - this.lastPointerInStack.length; i -= 1) {
            arr[i] = 0;
        }
    }

    // Heap methods
    alloc(bytes) {
        this.checkHeapSize(bytes);

        const arr = new Uint8Array(this.buffer);

        let pos = this.heapTail;
        let len = 0;

        for (let i = this.heapTail; i < this.heapTail + bytes; i += 1) {
            arr[i] = 1;
            pos += 1;
            len += 1;
        }

        const start = this.heapTail;
        this.heapTail = pos;

        return new HeapPointer(start, len, this.buffer);;
    }
    
    // Help methods
    checkStackSize(buffer) {
        if (this.stackTail + buffer.byteLength >= this.stackSize) {
            throw new RangeError('Stack is overloaded');
        }
    }

    checkHeapSize(bytes) {
        if (this.heapTail + bytes >= this.heapSize) {
            throw new RangeError('Heap is overloaded');
        }
    }

    checkIfStackIsEmpty() {
        if (this.stackTail.length === 0) {
            throw new Error('Stack is empty');
        };
    }
}