class ListNode {
    constructor(value, next = null, prev = null) {
        this.value = value;
        this.next = next;
        this.prev = prev;
    }
}

class LinkedList {
    constructor() {
        this.first = null;
        this.last = null;
    }

    add(value) {
        const node = new ListNode(value);

        if (!this.first) {
            this.first = node;
            this.last = node;
            return;
        }

        this.last.next = node;
        node.prev = this.last;
        this.last = node;
    }
}
const list = new LinkedList();

list.add(1);
list.add(2);
list.add(3);
list.add(4);
list.add(5);

// console.log(list.first.value);           // 1
// console.log(list.last.value);            // 3
// console.log(list.first.next.value);      // 2
// console.log(list.first.next.prev.value); // 1
// console.log(list.first.next.next.value); // 3
// console.log(list.first.next.next.prev.value); // 2

///

class LinkedListIterable {
    constructor() {
        this.first = null;
        this.last = null;
        this.currentNode = null; // For iterator
    }

    add(value) {
        const node = new ListNode(value);

        if (!this.first) {
            this.first = node;
            this.last = node;
            this.currentNode = this.first;
            return;
        }

        this.last.next = node;
        node.prev = this.last;
        this.last = node;
    }

    [Symbol.iterator]() {
        let current = this.first;

        return {
            next: () => {
                if (!current) {
                    return {done: true, value: undefined};
                }
                
                const saved = current;
                current = current.next;
                return {done: false, value: saved.value};
            }
        }
    }

}

const listIterable = new LinkedListIterable();

listIterable.add(1);
listIterable.add(2);
listIterable.add(3);
listIterable.add(4);
listIterable.add(5);

for (const node of listIterable) {
    console.log(node);
}

