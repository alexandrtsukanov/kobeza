import {parentPort} from 'node:worker_threads';

let doc = null;
let port;

// parentPort.on('message', (document) => {
//     console.log(111, document);
//     doc = document;
// });

parentPort.postMessage('document');

// parentPort.on('message', (data) => {
//     if (data.type === 'connect') {
//         console.log(111, data);
//         doc = data;
//         port = data.port;
//         port.postMessage('MESSAGE');
//         port.on('message', console.log);
//     }
// });

// console.log(doc);