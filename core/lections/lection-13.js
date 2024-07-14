const graph = {};

const bfs = (graph, cb) => {
    if (graph === null) {
        return;
    }

    const queue = [];

    while (queue.length) {
        const head = queue.shift();
        cb(head.value);
        head.neighbors.forEach(node => queue.push(node));
    }
}

function topologicalSort(graph) {
    const map = new Map(graph.map(el => [el.id, el]));

    const visited = new Set();

    const result = [];

    function traverse(node) {
        if (visited.has(node)) {
            return;
        }
    
        visited.add(node);

        node.dependencies.forEach(id => {
            traverse(map).get(id)
        });

        result.push(node);
    }

    graph.forEach(node => {
        traverse(node);
    });

    return result;
}