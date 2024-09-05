class Storage {
    constructor() {
        this.buffer = new Map();
    }

    get(key) {
        return this.buffer.get(key);
    }

    setToBuffer(key, value) {
       this.buffer.set(key, value);
    }

    removeFromBuffer(key) {
        this.buffer.delete(key);
    }

    clear() {
        this.buffer.clear();
    }

    key(index) {
        return [...this.buffer.keys()][index];
    }

    length() {
        return this.buffer.size;
    }
}

class LocalStorage extends Storage {
    constructor() {
        super();
        this.buffer = this.#convertLSToMap();
    }

    set(key, value) {
        localStorage.setItem(key, value);

        this.setToBuffer(key, value);
    }

    remove(key) {
        localStorage.removeItem(key, value);

        this.removeFromBuffer(key);
    }

    #convertLSToMap() {
        const buffer = new Map();

        for (let i = 0; i < localStorage.length; i += 1) {
            const key = localStorage.key(i) || '';
            const value = localStorage.getItem(key);

            buffer.set(key, value);
        }

        return buffer;
    }
}

class CookieStorage extends Storage {
    constructor() {
        super();
        this.delimeter = '; ';
        this.buffer = this.#convertCookieToMap();
    }

    setCookie(key, value) {
        options = {
            path: '/',
            ...options
        };
        
        if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString();
        }
        
        let updatedCookie = encodeURIComponent(key) + '=' + encodeURIComponent(value);
        
        for (let optionKey in options) {
            updatedCookie += '; ' + optionKey;

            let optionValue = options[optionKey];

            if (optionValue !== true) {
              updatedCookie += '=' + optionValue;
            }
        }
        
        document.cookie = updatedCookie;
    }

    set(key, value) {
        this.setCookie(key, value);
        this.setToBuffer(key, value);
    }

    remove(key) {
        this.setCookie(key, '', {
            'max-age': -1,
        })
        
        this.removeFromBuffer(key);
    }

    #convertCookieToMap() {
        const rawCookie = document.cookies.split(this.delimeter);

        return rawCookie.reduce((result, cookie) => {
            const [key, value] = cookie.split('=');

            result.set(
                decodeURIComponent(key),
                decodeURIComponent(value),
            );

            return result;
        }, new Map());
    }
}

const ls = new LocalStorage();

ls.set('a', 42);
console.log(ls.get('a')) // 42;

const cookie = new CookieStorage();

cookie.set('a', 42);
console.log(cookie.get('a')) // 42;