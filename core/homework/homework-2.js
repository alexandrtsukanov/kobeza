const instructions = {
    'SET A': 0,
    'PRINT A': 1,
    'IFN A': 2,
    'RET': 3,
    'DEC A': 4,
    'JMP': 5
};

const program = [
    // Ставим значения аккумулятора
    instructions['SET A'],
    // В 10
    10,
    
    // Выводим значение на экран
    instructions['PRINT A'],
    
    // Если A равно 0
    instructions['IFN A'],
    
    // Программа завершается
    instructions['RET'],
    
    // И возвращает 0
    0,

    // Уменьшаем A на 1
    instructions['DEC A'],
    
    // Устанавливаем курсор выполняемой инструкции
    instructions['JMP'],
    
    // В значение 2
    2
];

// Выведет в консоль
// 10
// 9
// 8
// 7
// 6
// 5
// 4
// 3
// 2
// 1
// 0
// И вернет 0
// execute(program);

console.log(execute(program))

function execute(program) {
    let value;
    let cursor = 0;

    while (true) {
        const instruction = program[cursor];

        if (instruction === instructions['SET A']) {
            value = program[cursor + 1];
            cursor += 2;
        }
        if (instruction === instructions['PRINT A']) {
            console.log(value);
            cursor += 1;
        }
        if (instruction === instructions['IFN A']) {
            if (value === 0) {
                cursor += 1;
            } else {
                cursor += 3;
            }
        }
        if (instruction === instructions['RET']) {
            return program[cursor + 1];
        }
        if (instruction === instructions['DEC A']) {
            value -= 1;
            cursor += 1;
        }
        if (instruction === instructions['JMP']) {
            cursor = program[cursor + 1];
        }
    }
}