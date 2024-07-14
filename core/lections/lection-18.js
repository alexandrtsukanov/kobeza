let s1 = 'Завтрак в 09:00 в комнате 123:456';
let r1 = /\b\d{2}:\d{2}\b/g;
// console.log(s1.match(r1));
//

let s2 = "Завтрак в 09:00. Ужин в 21-30";
let r2a = /\b\d{2}[:-]\d{2}\b/g;
let r2b = /\b\d{2}(:|-)\d{2}\b/g

// console.log(s2.match(r2a));
// console.log(s2.match(r2b));

let s3 = 'Привет!... Как дела?.....';
let r3 = /\.{3,}/g
// console.log(s3.match(r3));

let s4 = 'color:#121212; background-color:#AA00ef bad-colors:f#fddee #fd2 #12345678';
let r4a = /#[0-9A-F]{6}\b/gi;
let r4b = /#\p{Hex_Digit}{6}\b/giu;
// console.log(s4.match(r4a));
// console.log(s4.match(r4b));

let r5 = /<!--.*?-->/gs;
let s5 = `... <!-- My -- comment
 test --> ..  <!----> ..
`; // <! ... >
// console.log(s5.match(r5) ); // '<!-- My -- comment \n test -->', '<!---->'

let r6 = /<\/?[^<>]+>/g;
let s6 = `<> <a href="/"> <input type="radio" checked> <b>`;
// console.log( s6.match(r6) )

let str = '<span class="my"> <span class="my">';

let regexp = /<(([a-z]+)\s*([^>]*))>/g;

let result = str.matchAll(regexp);
// console.log([...result]); // <span class="my">
// console.log(result[1]); // span class="my"
// console.log(result[2]); // span
// console.log(result[3]); // class="my"

let results = '<h1> <h2>'.matchAll(/<(.*?)>/gi);

for(let result of results) {
    // console.log(result);
  // первый вывод: <h1>,h1
  // второй: <h2>,h2
}

//
// Java, JavaScript, PHP, C, C++
let r7 = /java(script)?|php|c(\+\+)?/gi;
let s7 = 'Java JavaScript PHP C++ C';
// console.log(s7.match(r7));