const myFizzBazz = fizzbuzz();

myFizzBazz.next(); // 1n
myFizzBazz.next(); // 2n
myFizzBazz.next(); // Fizz
myFizzBazz.next(); // Buzz
myFizzBazz.next(); // Fizz
// ...

function fizzbuzz() {
    let current = BigInt(0);
    const divider3 = BigInt(3);
    const divider5 = BigInt(5);

    return {
        next() {
            current += 1n;

            if (current % divider3 === 0n && current % divider5 === 0n) {
                return 'FizzBuzz';
            }

            if (current % divider3 === 0n) {
                return 'Fizz';
            }

            if (current % divider5 === 0n) {
                return 'Buzz';
            }

            return current;
        }
    }
}

// const myFB = fizzbuzz();
// console.log(myFB.next())
// console.log(myFB.next())
// console.log(myFB.next())
// console.log(myFB.next())
// console.log(myFB.next())
// console.log(myFB.next())
// console.log(myFB.next())
// console.log(myFB.next())
// console.log(myFB.next())
// console.log(myFB.next())
// console.log(myFB.next())
// console.log(myFB.next())
// console.log(myFB.next())
// console.log(myFB.next())
// console.log(myFB.next())