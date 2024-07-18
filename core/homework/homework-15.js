function heapSort(arr) {
    for (let i = 0; i < arr.length; i += 1) {
        siftUp(arr, i);
    }

    for (let i = arr.length - 1; i > 0; i -= 1) {
        swap(arr, 0, i);
        siftDown(arr, 0, i);
    }
}

function siftUp(arr, i) {
    while (i > 0) {
        const parentIndex = Math.floor((i - 1) / 2);
        const parent = arr[parentIndex];

        if (comparator(parent, arr[i]) > 0) {
            break;
        }

        swap(arr, parentIndex, i);
        i = parentIndex;
    }
}

function siftDown(arr, i, end) {
    let left = i * 2 + 1;
    let right = i * 2 + 2;
    let childIndex;

    while (left < end) {
        if (right >= end || comparator(arr[left], arr[right]) > 0) {
            childIndex = left;
        } else {
            childIndex = right;
        }

        if (comparator(arr[i], arr[childIndex]) > 0) {
            break;
        }

        swap(arr, i, childIndex);
        left = childIndex * 2 + 1;
        right = childIndex * 2 + 2;
        i = childIndex;
    }
}

function swap(arr, l, r) {
    let temp = arr[l];
    arr[l] = arr[r];
    arr[r] = temp;
}

function comparator(a, b) {
    return a > b ? 1 : -1;
}

// const arr = [2,5,7,8,6,4,9,3,10,1];
// heapSort(arr);
// console.log(arr);