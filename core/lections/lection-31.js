function* task(time) {
    let start = Date.now();

    console.log('Start');

    for (let i = 0; i < 1000000; i += 1) {
        // ...

        if (Date.now() - start >= time) {
            // yield;
            // Or
            console.log('Sleep');
            const newTime = yield Date.now() - start;
            console.log('Awake');
            time = newTime ?? time;
            start = Date.now();
        }
    }

    console.log('Finish');
}

const t = task(10);

console.log(t.next());
console.log(t.next());
console.log(t.next());
console.log(t.next());
console.log(t.next());
console.log(t.next());
console.log(t.next());
console.log(t.next());
console.log(t.next());

class Scheduler {
    constructor({total, quant, delay}) {
        this.queue = [];
        this.total = total;
        this.quant = quant;
        this.delay = delay;
        this.destroyed = false;

        this.run();
    }

    [Symbol.dispose]() {
        this.destroy();
    }

    destroy() {
        this.destroyed = true;
        this.queue.forEach(task => task.return());
    }

    addTask(task) {
        this.queue.push(task(this.quant));
    }

    async run() {
        while (true) {
            let start = Date.now();
    
            while (this.queue.length > 0) {
                const task = this.queue.shift();
                const {done} = task.next(this.quant);
    
                if (!done) {
                    this.queue.push(task);
                }
    
                if (Date.now() - start > this.total) {
                    await new Promise((resolve) => setTimeout(resolve, this.delay));
                    start = Date.now();
                }
            }

            await new Promise((resolve) => setTimeout(resolve, this.delay));
        }
    }
}

const scheduler = new Scheduler({
    total: 200,
    quant: 10,
    delay: 50,
});

scheduler.addTask(task);
scheduler.addTask(task);
scheduler.addTask(task);
