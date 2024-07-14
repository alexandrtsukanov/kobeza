// console.log('й' !== 'й')

const collatorCompare = new Intl.Collator('ru').compare;
console.log(
    Array.from('яёеа').sort(collatorCompare)
)

var s = 'й';
console.log(s.normalize())

var s1 = 'ё';
    s2 = 'ж';

console.log(s1 < s2)
