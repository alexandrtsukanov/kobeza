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
console.log(executeRecursive(program))

function execute(program) {
    let a = program[1];

    console.log(a);

    while (a !== 0) {
        a -= 1;
        console.log(a);
    }

    return a;
}

// То же рекурсивно
function executeRecursive(program) {
    let a = program[1];

    const inner = variable => {
        console.log(variable);
    
        if (variable === 0) {
            return variable;
        }

        return inner(variable - 1);
    }

    return inner(a);
}
