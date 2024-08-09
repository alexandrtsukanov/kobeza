import {parentPort} from 'node:worker_threads';

parentPort.postMessage('i am alive');

parentPort.on('message', console.log)

// Pass data from another worker
parentPort.postMessage({to: 'w2', data: [1, 2, 3]});

let port;

parentPort.on('message', data => {
    if (data.type === 'connect') {
        port = data.port;
        port.postMessage('hello there');
        port.on('message', console.log);
    }
})

parentPort.on('message', (data) => {
    console.log(data);
})