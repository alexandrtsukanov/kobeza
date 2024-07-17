class Memory {
    constructor(size, stackData) {
        this.buffer = new ArrayBuffer(size);
        this.size = size;
        this.stack = stackData.stack;
        this.heap = this.size - this.stack;
        this.head = 0;
        this.top = 0;
    }

    push(bytes) {
        const arr = new Uint8Array(this.buffer);
        arr[]
    }
}