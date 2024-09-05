class Storage {
    constructor() {
        this.buffer = new Map();
    }

    get(key) {
        return this.buffer.get(key);
    }

    set(key, value) {
       this.buffer.set(key, value);
    }

    remove(key) {
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