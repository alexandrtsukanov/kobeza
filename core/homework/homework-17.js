class Trie {
    constructor() {
        this.value = '';
        this.children = {};
        this.isTerm = false;
        this.buffer = [];
    }

    addWord(str) {
        let node = this;

        for (let i = 0; i < str.length; i += 1) {
            const char = str[i];

            if (!node.children[char]) {
                const newNode = new Trie();
                newNode.value = char;
                node.children[char] = newNode;
            }

            node = node.children[char];
        }

        node.isTerm = true;
    }

    go(char) {
        let node = this.findNode()
    }
}

const trie = new Trie();
trie.addWord('cat');
// console.dir(trie, {depth: null})


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
        if ((patternArr[i] === '**' || patternArr[i] === '*') && i === patternArr.length - 1) {
            break;
        }
        if (patternArr[i] === '*') {
            const next = patternArr[i + 1];
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
// console.log(doesMatch('foo.*.bar.**', 'foo'))
// console.log(match('foo.*.bar.**', ['foo', 'foo.bla.bar.baz', 'foo.bag.bar.ban.bla']));

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