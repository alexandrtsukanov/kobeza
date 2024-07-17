class Graph {
    constructor(matrix) {
        this.matrix = matrix;
    }

    checkAdjacency(v1, v2) {
        return this.matrix.get(v1, v2) !== 0;
    }

    createEdge(v1, v2, weight = 1) {
        this.matrix.set(v1, v2, weight);
        this.matrix.set(v2, v1, weight);
    }

    removeEdge(v1, v2) {
        this.matrix.set(v1, v2, 0);
        this.matrix.set(v2, v1, 0);
    }

    createArc(v1, v2, weight = 1) {
        this.matrix.set(v1, v2, weight);
        this.matrix.set(v2, v1, 0);
    }

    removeArc(v1, v2) {
        this.matrix.set(v1, v2, 0);
    }

    // Itaretive
    traverse(v, cb) {
        const len = this.matrix.columns;
        let count = len;
        let start = v * len
        const visited = new Set();

        cb(v);
        visited.add(v);

        while (count) {
            let metAdjecency = false;

            for (let i = start; i < start + len; i += 1) {
                const currentAdjencency = this.matrix.buffer[i];
                const currentVertex = i % len;
    
                if (currentAdjencency !== 0 && !visited.has(currentVertex)) {
                    cb(currentVertex);
                    start = currentVertex * len;
                    visited.add(currentVertex);
                    metAdjecency = true;
                    count -= 1;
                    break;
                }
            }

            if (!metAdjecency) {
                break;
            }
        }
    }
}

class Matrix {
    constructor(typedArrayConstructor, rows, columns) {
        this.rows = rows;
        this.columns = columns;
        const capacity = rows * columns;
        this.buffer = new typedArrayConstructor(capacity);
    }

    set(r, c, value) {
        const index = this.getIndex(r, c);
        this.buffer[index] = value;
    }

    get(r, c) {
        const index = this.getIndex(r, c);
        return this.buffer[index];
    }

    getIndex(r, c) {
        return r * this.columns + c;
    }
}

const adjacencyMatrix = new Matrix(Uint8Array, 10, 10);
const graph = new Graph(adjacencyMatrix);
graph.createEdge(2, 7);
graph.createEdge(1, 8);
console.log(graph.checkAdjacency(7, 2));

// graph.createArc(2, 7, 10);
// graph.createArc(1, 8, 20);
graph.createEdge(2, 4, 20);
graph.createEdge(4, 5, 20);
graph.createEdge(5, 3, 20);
graph.createEdge(3, 6, 20);
graph.createEdge(6, 7, 20);
graph.createEdge(6, 8, 20);

console.log(graph.checkAdjacency(7, 2)) 

console.log(adjacencyMatrix.buffer);

graph.traverse(2, console.log);