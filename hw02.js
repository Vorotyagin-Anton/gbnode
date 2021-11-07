function hw02() {
    hw02_01();
    setTimeout(() => hw02_02(arguments), 1000);
}

function hw02_01() {
    /* Первый цикл:
    1. 'Record 1' - выполняется синхронный код в фазе poll.
    2. 'Record 5' - выполняется синхронный код в фазе poll.
    3. 'Record 6' - выполняется код из очереди микрозадач (очередь микрозадач формируется в два шага, т.к. два промиса).
    Второй цикл:
    4. 'Record 2' - в фазе timers запускается код из setTimeout() и выполняется синхронный код.
    5. Из очереди микрозадач выполняется новый setTimeout().
    Третий цикл:
    6. 'Record 3' - в фазе timers запускается код из setTimeout() и выполняется синхронный код.
    7. 'Record 4' - выполняется код из очереди микрозадач. */

    console.log('Record 1');

    setTimeout(() => {
        console.log('Record 2');
        Promise.resolve().then(() => {
            setTimeout(() => {
                console.log('Record 3');
                Promise.resolve().then(() => {
                    console.log('Record 4');
                });
            });
        });
    });

    console.log('Record 5');

    Promise.resolve().then(() => Promise.resolve().then(() => console.log('Record 6')));
}

// Программа с таймерами
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {};

const emitterObject = new MyEmitter();

emitterObject.on('startTimer', timerHandler);

function timerHandler(date) {
    const dateParams = date.split('-');
    const dateInMs = new Date(dateParams[3], Number(dateParams[2]) - 1, dateParams[1], dateParams[0]);
    let dateDif = Math.trunc((dateInMs.getTime() - Date.now())/1000) - 540;

    setInterval(() => {
        if (dateDif > 0) {
            console.log(`До указанной даты(${date}) осталось ${dateDif} секунд`);
        }
        else if (dateDif === 0) {
            console.log(`Указанная дата(${date}) настала!`);
        }
        dateDif -= 1;
    }, 1000);
}

function hw02_02(dates) {
    for (let date of dates) {
        emitterObject.emit('startTimer', date);
    }
}

module.exports = hw02;