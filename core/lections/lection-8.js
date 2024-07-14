class Matrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.buffer = new Array(rows * cols);
    }

    get(row, col) {
        return this.buffer[this.#getIndex(row, col)];
    }

    set(row, col, value) {
        this.buffer[this.#getIndex(row, col)] = value;
    }

    #getIndex(row, col) {
        return row * this.cols + col;
    }
}

//

// Hash Table
var a = [];
a[100] = 1;
a.push(7);
console.log(a);
delete a[101]
console.log(a);
