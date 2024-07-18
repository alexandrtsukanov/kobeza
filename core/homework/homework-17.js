class Trie {
    constructor() {
        this.buffer = [];
        this.length = 0;
        this.value = '';
        this.children = [];
        this.isTerm = false;
        this.positon = 0;
        this.cursor = 0;
    }

    addWord(str) {
        const firstChar = this.buffer.find(el => el.value === str[0] && el.positon === 0);

        if (!firstChar) {
            this.pushChars(str);
            return;
        }

        let presentChar = firstChar;
        let i = 1;

        for (i = 1; i < str.length; i += 1) {
            const char = str[i];
            const children = presentChar.children.map(i => this.buffer[i]);
            const nextChar = children.find(el => el.value === char);

            if (nextChar) {
                presentChar = nextChar;
            } else {
                presentChar.children.push(this.length);
                break;
            }
        }

        this.pushChars(str, i);
    }

    pushChars(str, start = 0) {
        for (let i = start; i < str.length; i += 1) {
            this.buffer[this.length] = {
                value: str[i],
                children: [],
                isTerm: i === str.length - 1,
                positon: i,
            }

            if (i !== start) {
                this.buffer[this.length - 1].children.push(this.length);
            }

            this.length += 1;
        }
    }

    go(char) {
        const index = this.findIndex(char);

        if (index === -1) {
            throw new Error('Symbol is missing');
        }

        this.cursor = index;
        return this;
    }

    isWord() {
        return this.buffer[this.cursor].isTerm;
    }

    findIndex(char) {
        for (let i = 0; i < this.buffer.length; i += 1) {
            if (this.buffer[i].value === char) {
                return i;
            }
        }

        return -1;
    }
}

const trie = new Trie();

// trie.addWord('cat');
// trie.addWord('car');
// trie.addWord('bag');

// console.log(trie.go('c').go('a').go('r').isWord());

// console.dir(trie, {depth: null})

// --- //

class Trie2 {
    constructor() {
        this.children = {};
        this.pos = null;
    }
}

function match(pattern, strs) {
    pattern = pattern.split('.');
    const result = [];
    const trie = createTrie(strs);

    const dfs = (node, slate) => {
        if (node.pos !== null) {
            if (doesMatch(pattern, slate)) {
                result.push(strs[node.pos]);
            }
        }

        for (const word in node.children) {
            slate.push(word);
            dfs(node.children[word], slate);
            slate.pop();
        }
    }

    dfs(trie, []);

    return result;
}

function doesMatch(patternArr, strArr) {
    let i
    let j = 0;

    for (i = 0; i < patternArr.length; i += 1) {
        if (patternArr[i] === '**' && i === patternArr.length - 1) {
            if (j > strArr.length - 1) {
                return false;
            } else {
                break;
            }
        }
        if (patternArr[i] === '*') {
            const next = patternArr[i + 1];
            j += 1;
            while (strArr[j] && strArr[j] !== next) {
                j += 1;
            }
            continue;
        }
        if (patternArr[i] !== strArr[j]) {
            return false;
        }
        j += 1;
    }
    return true;
}

function createTrie(strs) {
    let trie = new Trie2();

    for (let i = 0; i < strs.length; i += 1) {
        addWord(trie, strs[i].split('.'), i);
    }

    return trie;
}

function addWord(node, arr, pos) {
    for (let i = 0; i < arr.length; i += 1) {
        const word = arr[i];

        if (!node.children[word]) {
            const newNode = new Trie2();
            node.children[word] = newNode;
        }

        node = node.children[word];
    }

    node.pos = pos;
}

// console.log(match('foo.*.bar.**', ['foo', 'foo.bla.bar.baz', 'foo.bag.bar.ban.bla']));
