class BCD {
    constructor(rawNumber) {
        this.buffer = [];
        this.bcd = '';
    }

    convertToBCD(num) {
        if (typeof num !== 'number') {
            num = Number(num);
        }

        if (isNaN(num)) {
            throw new Error('Invalid number');
        }

        
    }
}