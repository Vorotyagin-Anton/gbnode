const colors = require("colors/safe");

function hw01(firstNumber, secondNumber) {
    if (!Number.isInteger(firstNumber) || !Number.isInteger(secondNumber)) {
        console.log(colors.red('Ошибка: можно передать только целые числа в качестве аргументов функции.'));
        return;
    }

    if (firstNumber >= secondNumber) {
        console.log(colors.red('Ошибка: первое число должно быть меньше второго.'));
        return;
    }

    if (firstNumber === 0 || firstNumber === 1) {
        firstNumber = 2;
    }

    const numbers = [];
    for (let i = firstNumber; i <= secondNumber + 1; i++) {

        let flag = true;
        for (let j = 2; j < i**0.5 + 1; j++) {
            if (i % j === 0) {
                flag = false;
                break;
            }
        }

        if (flag) {
            numbers.push(i);
        }
    }

    if (!numbers.length) {
        console.log(colors.green('Нет простых чисел в диапазоне.'));
        return;
    }

    let order = 1;
    numbers.forEach((number) => {
       if (order === 1) {
           console.log(colors.green(number));
           order = 2;
       } else if (order === 2) {
           console.log(colors.yellow(number));
           order = 3;
       } else if (order === 3) {
           console.log(colors.red(number));
           order = 1;
       }
    });
}

module.exports = hw01;