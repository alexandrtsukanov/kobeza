import {Worker, MessageChannel} from 'node:worker_threads';

const workerDom = new Worker('./worker-dom.mjs');

workerDom.postMessage({value: 'document'});

//

const channel = new MessageChannel();

workerDom.postMessage({type: 'connect', port: channel.port1}, [channel.port1]);
channel.port1.on('message', (d) => console.log('parent =>', d));

// workerDom.on('message', console.log);




// function requireScripts(module) {
    
// }


// requireScripts('./worker-dom.js');