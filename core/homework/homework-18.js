// ## Необходимо написать регулярное выражение
// Которое при вызове test на строке будет давать false, если в строке есть символы отличные от латинских, цифр, подчеркивания и знака $.

const myRegExp = /^[\w\$]*$/

console.log(myRegExp.test('привет')); // false


// ## Необходимо создать массив на основе строки
// Элементы в строке разделены сепараторами `;` и `,`. Необходимо возвращать первый числовой элемент `;` последовательности.

const myRegExp2 = /,\d+,\d+;/

console.log('762120,0,22;763827,0,50;750842,0,36;749909,0,95;755884,0,41;'.split(myRegExp2)) // ['762120', '763827', '750842', '749909', '755884']


// ## Итератор на основе строки
// Необходимо создать итератор на основе исходной строки.
// [['"a": 1', 'a', '1'], ['"b": "2"', 'b', '"2"']]
// [...'{"a": 1, "b": "2"}'.matchAll(myRegExp)];

const myRegExp3 = /((["']?)\w+\2):\s((["']?)\d+\4)/g;

console.log([...'{"a": 1, "b": "2"}'.matchAll(myRegExp3)]);


// ## Необходимо написать функцию, которая принимает строковый шаблон и объект параметров, и возвращает результат применения данных к этому шаблону
// Hello, Bob! Your age is 10.

const format = (str, data) => {
    return str.replace(/\$\{([a-z]+)\}/g, (...args) => data[args[1]]);
}

const res = format('Hello, ${user}! Your age is ${age}.', {user: 'Bob', age: 10});
console.log(res);


// ## Нахождение арифметических операций в строке и замена на результат

function calc(text) {
    const re = /\(?\d+\s*([+-\\]|\*{1,2})\s*\d+(\s*([+-\\]|\*{1,2})\s*\d+)*(\)?(\s*([+-\\]|\*{1,2})\s*\d+)*)?/g;  // Not correct completely
    return text.replace(re, (...args) => eval(args[0]))
}

console.log(
    calc('Какой-то текст (10 + 15 - 24) ** 2 Еще какой-то текст 2 * 10') 
        ==
    'Какой-то текст 1 Еще какой-то текст 20'
);
