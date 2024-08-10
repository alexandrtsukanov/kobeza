import {Worker, MessageChannel} from 'node:worker_threads';

const workerDom = new Worker('./worker-dom.mjs');

let dom;

const p = new Promise((resolve) => {
    workerDom.on('message', data => {
        resolve(data);
    })
})

p.then(data => {
    dom = data;
    console.log(dom);
})

console.log('!!!! ====>', dom);

// workerDom.postMessage({value: 'document'});

// //

// const channel = new MessageChannel();

// workerDom.postMessage({type: 'connect', port: channel.port1}, [channel.port1]);
// channel.port1.on('message', (d) => console.log('parent =>', d));

// workerDom.on('message', console.log);




// function requireScripts(module) {
    
// }


// requireScripts('./worker-dom.js');