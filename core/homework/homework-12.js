function indexOf(arr, comparator) {
    const search = (arr, left, right) => {
        if (left >= right) {
            return -1;
        }

        const mid = Math.floor((left + right) / 2);
        
        if (comparator(arr[mid]) === 0) {
            return mid;
        } else {
            if (comparator(arr[mid]) > 0) {
                return search(arr, left, mid);
            } else {
                return search(arr, mid + 1, right);
            }
        }
    }

    let index = search(arr, 0, arr.length);

    if (index === -1) {
        return index;
    }

    while (arr[index - 1] && comparator(arr[index - 1]) === 0) {
        index -= 1;
    }

    return index;
}

function lastIndexOf(arr, comparator) {
    const search = (arr, left, right) => {
        if (left >= right) {
            return -1;
        }

        const mid = Math.floor((left + right) / 2);
        
        if (comparator(arr[mid]) === 0) {
            return mid;
        } else {
            if (comparator(arr[mid]) > 0) {
                return search(arr, left, mid);
            } else {
                return search(arr, mid + 1, right);
            }
        }
    }

    let index = search(arr, 0, arr.length);

    if (index === -1) {
        return index;
    }

    while (arr[index + 1] && comparator(arr[index + 1]) === 0) {
        index += 1;
    }

    return index;
}

const arr = [{age: 12, name: 'Bob'}, {age: 42, name: 'Ben'}, {age: 42, name: 'Jack'}, {age: 42, name: 'Sam'}, {age: 56, name: 'Bill'}];

// Если число положительное, то значит надо идти налево.
// Если число 0, то значит надо запомнить позицию и идти налево.
// Если число отрицательное, то значит идти налево.

console.log(indexOf(arr, ({age}) => age - 42));     // 1
console.log(lastIndexOf(arr, ({age}) => age - 42)); // 3

// Не найдено
console.log(lastIndexOf(arr, ({age}) => age - 82)); // -1