class Trie {
    constructor() {
        this.children = {};
        this.pos = null;
    }
}

function addNode(node, str) {
    for (let i = 0; i < str.length; i += 1) {
        const char = str[i];

        if (!node.children[char]) {
            const newNode = new Trie(char);
            node.children[char] = newNode;
        }

        node = node.children[char];
    }

    node.isTerm = true;
}

function createTrie(strs) {
    let trie = new Trie();

    for (const str of strs) {
        addNode(trie, str);
    }

    return trie;
}

// console.dir(createTrie(['cat', 'car', 'core', 'bag']), {depth: null})

const substrs = ['foo', 'bar', 'foz', 'bla'];

const trie = {
    word: false,
    children: {
        f: {
            word: false,
            children: {
                o: {
                    word: false,
                    children: {
                        o: {
                            word: true,
                            children: {},
                        },
                        z: {
                            word: true,
                            children: {},
                        }
                    }
                }
            }
        },
        b: {
            word: false,
            children: {
                a: {
                    word: false,
                    children: {
                        r: {
                            word: true,
                            children: {},
                        }
                    }
                },
                l: {
                    word: false,
                    children: {
                        a: {
                            word: true,
                            children: {},
                        }
                    }
                }
            }
        },
    }
}

const str = 'blbar';

let cursor = trie;

for (let i = 0; i < str.length; i += 1) {

}