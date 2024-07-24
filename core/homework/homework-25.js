function debounce(cb, ms) {
    let timeout;

    return function() {
        const innerCb = () => cb.apply(this, arguments);
        clearTimeout(timeout);
        timeout = setTimeout(innerCb, ms);
    }
}

function laugh() {
    console.log('Ha-ha!')
}

const debouncedLaugh = debounce(laugh, 3000);

// debouncedLaugh();
// debouncedLaugh();
// debouncedLaugh();
// debouncedLaugh();
// debouncedLaugh(); // Выполнится через 300 мс

function throttle(cb, ms) {
    let isThrottled = false;
    let args;
    let context;

    function inner() {
        if (isThrottled) {
            args = arguments;
            context = this;
            return;
        }

        cb.apply(this, arguments);

        isThrottled = true;

        setTimeout(() => {
            isThrottled = false;
            
            if (args && context) {
                inner.apply(args, context);
                args = undefined;
                context = undefined;
            }
        }, ms);
    }

    return inner;
}

function laugh2() {
    console.log('Ha-ha!')
}
  
const throttledLaugh = throttle(laugh2, 3000);
  
throttledLaugh(); // Выполнится сразу
throttledLaugh();
throttledLaugh();
throttledLaugh();
throttledLaugh(); // Выполнится через 300 мс