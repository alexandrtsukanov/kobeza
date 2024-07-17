class Pointer {
    constructor(index, size, buffer) {
        this.index = index;
        this.size = size;
        this.buffer = buffer;
    }

    change(newBuffer) {
        const bufferArr = new Uint8Array(newBuffer);
        const arr = new Uint8Array(this.buffer);

        if (this.size !== bufferArr.byteLength) {
            throw new Error('New data size and current data size are different');
        }

        for (let i = this.index; i < this.index + this.size; i += 1) {
            arr[i] = bufferArr[i];
        }
    }
}

class StackPointer extends Pointer {
    constructor(index, size, buffer) {
        super(index, size, buffer);
    }

    deref() {
        return new Uint8Array(this.buffer, this.index, this.size).buffer;
    }
}

class HeapPointer extends Pointer {
    constructor(index, size, buffer, heap) {
        super(index, size, buffer);
        this.heap = heap;
    }

    free() {
        const arr = new Uint8Array(this.buffer);

        for (let i = this.start; i < this.index + this.size; i += 1) {
            arr[i] = 0;
        }

        this.heap.heapPointers = this.heap.heapPointers.filter(p => p.index !== index);
    }
}

class Memory {
    constructor(size, stackData) {
        this.buffer = new ArrayBuffer(size);
        this.stackSize = stackData.stack;
        this.heapSize = size - this.stackSize;
        this.stackPointers = [];
        this.heapPointers = [];
    }

    // Stack methods
    push(buffer) {        
        const len = bufferArr.byteLength;
        const lastPointer = this.stackPointers[this.stackPointers.length - 1];
        const start = lastPointer
            ? lastPointer.index + lastPointer.size
            : 0
        
        this.checkStackSize(start, buffer);

        const arr = new Uint8Array(this.buffer);
        const bufferArr = new Uint8Array(buffer);

        for (let i = start; i < start + len; i += 1) {
            arr[i] = bufferArr[i];
        }

        const pointer = new StackPointer(start, len, this.buffer);
        this.stackPointers.push(pointer);

        return pointer;
    }

    pop() {
        this.checkIfStackIsEmpty();

        const arr = new Uint8Array(this.buffer);
        const lastPointer = this.stackPointers.pop();
        const {index, size} = lastPointer;

        for (let i = index; i < index + size; i += 1) {
            arr[i] = 0;
        }
    }

    // Heap methods
    alloc(bytes) {
        let start;
        let pointerToInsert;

        if (this.heapPointers.length === 0) {
            this.checkHeapSize(this.stackSize, bytes);
            start = 0;
            pointerToInsert = 1;
        }

        for (let i = 0; i < this.heapPointers.length - 1; i += 1) {
            const {index, size} = this.heapPointers[i];
            const {index: nextIndex} = this.heapPointers[i + 1];

            if (nextIndex - (index + size) >= bytes) {
                start = index + size;
                pointerToInsert = i + 1;
                break;
            }
        }

        if (start === undefined) {
            start = this.heapPointers[this.heapPointers.length - 1].index + this.heapPointers[this.heapPointers.length - 1].size;
            this.checkHeapSize(start, bytes);
            pointerToInsert = this.heapPointers.length;
        }

        const arr = new Uint8Array(this.buffer);

        for (let i = start; i < start + bytes; i += 1) {
            arr[i] = 1;
        }

        const pointer = new HeapPointer(start, bytes, this.buffer, this);
        this.heapPointers.splice(pointerToInsert, 0, pointer);

        return pointer;
    }
    
    // Help methods
    checkStackSize(offset, buffer) {
        if (offset + buffer.byteLength > this.stackSize) {
            throw new RangeError('Stack is overloaded');
        }
    }

    checkHeapSize(offset, bytes) {
        if (offset + bytes > this.heapSize) {
            throw new RangeError('Heap is overloaded');
        }
    }

    checkIfStackIsEmpty() {
        if (this.stackPointers.length === 0) {
            throw new Error('Stack is empty');
        };
    }
}