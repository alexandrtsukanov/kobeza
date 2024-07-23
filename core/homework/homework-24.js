const SYNTAX_ERROR = 'Syntax Error';

function tag(str) {
    function* parse(text, index = 0) {
        let i = 0;
        let result = '';
    
        for (index; index < text.length; index += 1) {
            const char = text[index];

            if (str[i] === char) {
                i += 1;
                result += char;
            } else {
                throw new SyntaxError(SYNTAX_ERROR);               
            }

            if (i === str.length) {
                return {type: 'TAG', value: result};
            }
        }
    
        throw new SyntaxError(SYNTAX_ERROR);
    };

    return parse;
}

const fnTag = tag('function')('function foo() {}');
// console.log(fnTag.next()); // {done: true, value: {type: 'TAG', value: 'function'}}

function take(pattern, options) {
    let finalPattern = pattern;

    if (typeof pattern === 'function') {
        finalPattern = pattern(...params);
    }

    const checker = (pattern, text) => {
        if (pattern instanceof RegExp) return pattern.test(text);
        return pattern === text;
    }

    function* parse(text, index = 0) {
        const {min = 1, max} = options ?? {};
    
        if (min > max || max === 0) throw new Error('Invalid min and max params');
    
        let counter = 0;
        let result = '';
    
        for (index; index < text.length; index += 1) {
            const char = text[index];

            if (checker(finalPattern, char)) {
                counter += 1;
                result += char;
    
                if (max !== undefined && counter === max) {
                    return {type: 'TAKE', value: result};
                }
            } else {
                if (counter >= min) {
                    index -= 1;
                    return {type: 'TAKE', value: result};
                } else {
                    throw new SyntaxError(SYNTAX_ERROR);
                }
            }
        }

        return {type: 'TAKE', value: result};
    }

    return parse;
}

const takeNumber = take(/\d/)('1234 foo');
// console.log(takeNumber.next()); // {done: true, value: {type: 'TAKE', value: '1234'}}
// const takeNumber2 = take(/\d/, {max: 2})('1234 foo');
// console.log(takeNumber2.next()); // {done: true, value: {type: 'TAKE', value: '12'}}
// const takeNumber3 = take(/\d/, {min: 2})('1 foo');
// console.log(takeNumber3.next());
// const takeNumber4 = take(/\d/, {min: 1, max: 3})('1234 foo');
// console.log(takeNumber4.next());
// const takeNumber5 = take(/\d/)('12345');
// console.log(takeNumber5.next());

function seq(...parsers) {
    function* parse(text, index = 0) {
        const tokens = [];
        let cursor = index;

        for (const parser of parsers) {
            const iterator = parser(text, cursor);
            const token = iterator.next().value;
            tokens.push(token);
            cursor += token.value.length;
        }

        return {type: 'SEQ', value: tokens.map(t => t.value).join('')};
    }

    return parse;
}

const fnSeq = seq(
    tag('function '),
    take(/[a-z_$]/i, {max: 1}),
    take(/\w/, {min: 0}),
    tag('()')
)('function foo() {}');

// console.log(fnSeq.next()); // {done: true, value: {type: 'SEQ', value: 'function foo()'}}

function or(...parsers) {
    function* parse(text, index = 0) {
        let cursor = index;

        for (const parser of parsers) {
            try {
                const iterator = parser(text, cursor);
                const {type, value} = iterator.next().value;
                return {type, value};
            } catch(e) {
                cursor = 0;
            }
        }

        throw new SyntaxError(SYNTAX_ERROR);
    }

    return parse;
}

const boolExpr = or(
    tag('true'),
    tag('aaa'),
    tag('bbb'),
    tag('ccc'),
    tag('false'),
)('false');
  
// console.log(boolExpr.next()); // {done: true, value: {type: 'TAG', value: 'false'}}

function repeat(parser, options) {
    const {min = 1, max = Infinity} = options ?? {};

    if (min > max || max === 0) throw new Error('Invalid min and max params');

    function* parse(text, index = 0) {
        let cursor = index;
        let counter = 0;

        while (counter < max) {
            try {
                const iterator = parser(text, cursor);
                const token = iterator.next().value;
                counter += 1;
                yield token;
                cursor += token.value.length;
            } catch(e) {
                if (min === 0 && counter === 0) {
                    yield {value: ''};
                }
                break;
            }
        }

        if (counter < min) {
            throw new SyntaxError(SYNTAX_ERROR);
        }
    }

    return parse;
}

const takeNumbers = repeat(
    seq(take(/\d/), tag(',')),
    {min: 1},
)('100,200,300,');
  
// console.log(takeNumbers.next()); // {done: false, value: {type: 'SEQ', value: '100,'}}
// console.log(takeNumbers.next()); // {done: false, value: {type: 'SEQ', value: '200,'}}
// console.log(takeNumbers.next()); // {done: false, value: {type: 'SEQ', value: '300,'}}

function opt(parser) {
    return repeat(parser, {min: 0, max: 1});
}

const takeNumbersOpt = repeat(
    seq(take(/\d/, {max: 3}), opt(tag(','))),
    {min: 1},
)('100,200300,400500');
  
// console.log(takeNumbersOpt.next()); // {done: false, value: {type: 'SEQ', value: '100,'}}
// console.log(takeNumbersOpt.next()); // {done: false, value: {type: 'SEQ', value: '200,'}}
// console.log(takeNumbersOpt.next()); // {done: false, value: {type: 'SEQ', value: '300'}}
// console.log(takeNumbersOpt.next()); // {done: false, value: {type: 'SEQ', value: '400,'}}
// console.log(takeNumbersOpt.next()); // {done: false, value: {type: 'SEQ', value: '500'}}