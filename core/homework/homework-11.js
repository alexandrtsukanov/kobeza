class HashMap {
    constructor(capacity) {
        this.buffer = new Array(capacity);
        this.capacity = capacity
        this.size = 0;
        this.constant = this.getCollisionConstant();
    }

    set(key, value) {
        if (this.size / this.capacity >= 0.6) {
            this.resize();
        }

        const index = this.hash(key);
        const finalIndex = this.getFinalIndex(index, key);

        this.buffer[finalIndex] = {key, value};
        this.size += 1;
    }

    get(key) {
        const index = this.hash(key);
        
        let current = this.buffer[index];

        while (current && current?.key !== key) {
            const newIndex = this.getNewIndex(index);
            current = this.buffer[newIndex];
        }

        return !current || !current.hasOwnProperty('value')
            ? undefined
            : current.value;
    }

    has(key) {
        return !!this.get(key);
    }

    delete(key) {
        let index = this.hash(key);
        let current = this.buffer[index];

        while (current && current?.key !== key) {
            index = this.getNewIndex(index);
            current = this.buffer[index];
        }

        if (!current || !current.hasOwnProperty('value')) {
            return;
        }

        delete this.buffer[index].value;
        this.size -= 1;
    }

    hash(value) {
        if (value === undefined) {
            throw new Error('Key cannot be undefined');
        }

        const str = JSON.stringify(value);

        return Math.floor((str[0].codePointAt(0) + str[str.length - 1].codePointAt(0)) / str.length) % this.capacity;
    }

    getNewIndex(i) {
        return (i + this.constant - i % this.constant) % this.capacity;;
    }
    
    getFinalIndex(i, key) {
        while (this.buffer[i] && this.buffer[i].hasOwnProperty('value') && this.buffer[i]?.key !== key) {
            i = this.getNewIndex(i);
        }

        return i;
    }

    resize() {
        const oldBuffer = this.buffer;
        const newCapacity = this.capacity * 2;
        this.buffer = new Array(newCapacity)
        this.capacity = newCapacity;

        for (let i = 0; i < oldBuffer.length; i += 1) {
            this.buffer[i] = oldBuffer[i];
        }
    }

    getCollisionConstant() {
        if (this.capacity <= 2) return 1;
        if (this.capacity > 2 && this.capacity <= 5) return 2;
        if (this.capacity > 5 && this.capacity <= 23) return 5;
        if (this.capacity > 23) return 23;
    }
}

const map = new HashMap(120);

// map.set('foo', 42);
// map.set('foo', 43);
// console.log(map.get('foo'));

// map.set('foo', 42);
// map.set('oof', 43);

// console.log(map.get('foo'));
// console.log(map.get('oof'));

// map.delete('foo');
// map.delete('oof');

// console.log(map.get('foo'));
// console.log(map.get('oof'));

// console.log(map.has('foo'));
// console.log(map.has('oof'));
