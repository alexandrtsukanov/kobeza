const a = new Uint8Array([1,2,3,4]);
const a2 = new Uint16Array(a.buffer);

const b = new ArrayBuffer(4);

const aa = new Uint8Array(b);
aa[0] = 1;
aa[1] = 2;
aa[2] = 3;
aa[3] = 4;
const aa2 = new Uint32Array(b);
aa2[1] = 3444
console.log(aa2);

// console.log(a2);
// console.log(a2.byteLength);

// const buffer = new ArrayBuffer(16);

// // console.log(buffer)

// const a3 = new Uint8Array(buffer, 0, 3);
// const a4 = new Int32Array(buffer, 0, 3);

// a3[0] = 100;
// a3[1] = 16;
// a3[2] = 1;

// console.log(a3.buffer);

// a4[0] = 4567;
// a4[1] = 10000;

// console.log(a3.buffer);

// console.log(a3);
// console.log(a4);

///

const buffer = new ArrayBuffer(8);
const uint8Array = new Uint8Array(buffer);
uint8Array[0] = 1;
uint8Array[1] = 2;
uint8Array[2] = 3;
uint8Array[3] = 4;
console.log(uint8Array)
console.log(buffer)
const uint32Array = new Uint32Array(buffer);
console.log(buffer)
console.log(uint32Array[0]); // 67305985

///

// const myarr = [1,2,3]
// myarr.fill(0);
// console.log(myarr);
// myarr.fill(4,1,3);
// console.log(myarr);

const aaa = new Uint16Array([1,2,3,4]);
console.log(aaa.length);