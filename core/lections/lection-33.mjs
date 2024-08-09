import {Worker, MessageChannel} from 'node:worker_threads';

const worker = new Worker('./w.mjs');
const worker2 = new Worker('./w2.mjs');

worker.on('message', message => {
    console.log('main =>', message);
});

worker.postMessage('hello world');

// Pass data to another worker
worker.on('message', transmission);
worker2.on('message', transmission);

function transmission(data) {
    if (data.to) {
        switch(data.to) {
            case 'w1': worker.postMessage(data.data);
            case 'w2': worker2.postMessage(data.data);
        }
    }
}

const channel = new MessageChannel();

worker.postMessage({type: 'connect', port: channel.port2}, [channel.port2]);
worker2.postMessage({type: 'connect', port: channel.port1}, [channel.port1]);

channel.port1.on('message', console.log);
channel.port2.on('message', console.log);

// Передача по владению

const value1 = {
    buf: Uint16Array.from({length: 100}, (_, i) => i),
}

// const value2 = structuredClone(value1, {transfer: [value1.buf.buffer]});

// console.log(value2);
console.log(value1.buf.buffer);

// worker.postMessage(value1, [value1.buf.buffer]) // Передача по владению, buffer есть только в получаемом потоке

// SharedArrayBuffer

const buf = new SharedArrayBuffer(16);

const value3 = {
    buf: new Uint16Array(buf).fill(1),
}

worker.postMessage(value3) // SharedArrayBuffer
