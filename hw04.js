#!/usr/bin/env node

const colors = require("colors/safe");
const fs = require("fs");
const es = require('event-stream');
const path = require("path");
const inquirer = require("inquirer");
const readline = require("readline");

// Запрашиваем путь к директории для сканирования и искомую подстроку
let currentDirectory = process.cwd();
let requiredSubstring = '';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Please enter the path to the directory you want to scan: ", function(inputedPath) {
    currentDirectory = inputedPath;
    rl.question("Please enter the required substring: ", function(inputedString) {
        requiredSubstring = inputedString;
        rl.close();
    });
});

// Сканируем директорию
function scanDir(dirPath) {
    const list = fs.readdirSync(dirPath);

    inquirer
        .prompt([
            {
                name: "fileName",
                type: "list",
                message: "Choose file:",
                choices: list,
            },
        ])
        .then((answer) => {
            const filePath = path.join(dirPath, answer.fileName);

            if (fs.lstatSync(filePath).isDirectory()) {
                scanDir(filePath);
            }
            else {
                fs.createReadStream(filePath, 'utf8')
                    .pipe(es.split())
                    .pipe(es.mapSync(function(line){
                        if (line.includes(requiredSubstring)) {
                            console.log(line);
                        }
                    }))
                    .on('error', function(err){
                        console.log('Error while reading file.', err);
                    })
                    .on('end', function(){
                        console.log('\n------------\nEnd of file.');
                    });
            }
        });
}

rl.on("close", function() {
    if (!currentDirectory) {
        console.log(colors.red('Error: Empty path received. Please, try again.'));
        return;
    }

    scanDir(currentDirectory);
});