// ## Необходимо написать функцию, которая бы принимала бы строку и "схлопывала" бы все подряд идущие повторения

function zipStr(str) {
    return str.replace(/(.)\1+/sg, '$1');
}

console.log(zipStr('abbaabbafffbezza')); // abafbeza

// ## Необходимо написать функцию, которая бы удаляла из строки все неуникальные символы
// TODO, no regexp

function unique(str) {
    const frequency = new Map();
    for (let i = 0; i < str.length; i += 1) {
        frequency.set(str[i], (frequency.get(str[i]) || 0) + 1);
    }
    let result = '';
    for (const [char, freq] of frequency.entries()) {
        if (freq === 1) result += char;
    }
    return result;
}

console.log(unique('abaceffgw')); // bcegw

// ## Необходимо написать функцию, которая бы находила в строке любые числа обозначающие деньги
// // ['100 00,53$', '500₽']

function findMoney(str) {
    return str.match(/\d+(\s\d+)?(,\d+)?\s*\p{Sc}/gu);
}

console.log(findMoney(`20.10.2020 Федор взял у меня 100 00,53$ и обещался вернуть не поздее 25 числа, но уже через 2 дня, он занял еще 500₽`));