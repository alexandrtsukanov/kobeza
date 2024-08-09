import {parentPort} from 'node:worker_threads';

parentPort.on('message', console.log);

let port;

parentPort.on('message', data => {
    if (data.type === 'connect') {
        port = data.port;
        port.postMessage('w2 hello there');
        port.on('message', console.log);
    }
})

