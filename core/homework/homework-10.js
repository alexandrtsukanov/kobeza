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
    constructor(start, length, buffer, heap) {
        super(start, length, buffer);
        this.heap = heap;
    }

    free() {
        const arr = new Uint8Array(this.buffer);

        for (let i = this.start; i < this.start + this.length; i += 1) {
            arr[i] = 0;
        }

        this.heap.heapOffset -= this.length;
    }
}

class Memory {
    constructor(size, stackData) {
        this.buffer = new ArrayBuffer(size);
        this.stackSize = stackData.stack;
        this.heapSize = size - this.stackSize;
        this.stackOffset = 0;
        this.heapOffset = this.stackSize;
        this.lastPointerInStack = null;
    }

    // Stack methods
    push(buffer) {
        this.checkStackSize(buffer);

        const arr = new Uint8Array(this.buffer);
        const bufferArr = new Uint8Array(buffer);

        let len = 0;

        for (let i = this.stackOffset; i < this.stackOffset + bufferArr.byteLength; i += 1) {
            arr[i] = bufferArr[i];
            len += 1;
        }

        const start = this.stackOffset;
        this.stackOffset += len;
        const pointer = new StackPointer(start, len, this.buffer);
        this.lastPointerInStack = pointer;

        return pointer;
    }

    pop() {
        this.checkIfStackIsEmpty();

        const arr = new Uint8Array(this.buffer);

        for (let i = this.stackOffset - 1; i > this.stackOffset - 1 - this.lastPointerInStack.length; i -= 1) {
            arr[i] = 0;
        }

        this.stackOffset -= this.lastPointerInStack.length;
    }

    // Heap methods
    alloc(bytes) {
        this.checkHeapSize(bytes);

        const arr = new Uint8Array(this.buffer);

        let len = 0;

        for (let i = this.heapOffset; i < this.heapOffset + bytes; i += 1) {
            arr[i] = 1;
            len += 1;
        }

        const start = this.heapOffset;
        this.heapOffset += len;

        return new HeapPointer(start, len, this.buffer, this);
    }
    
    // Help methods
    checkStackSize(buffer) {
        if (this.stackOffset + buffer.byteLength >= this.stackSize) {
            throw new RangeError('Stack is overloaded');
        }
    }

    checkHeapSize(bytes) {
        if (this.heapOffset + bytes >= this.heapSize) {
            throw new RangeError('Heap is overloaded');
        }
    }

    checkIfStackIsEmpty() {
        if (this.stackOffset.length === 0) {
            throw new Error('Stack is empty');
        };
    }
}