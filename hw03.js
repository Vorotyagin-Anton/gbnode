const fs = require('fs');
const es = require('event-stream');

const ip1 = '89.123.1.41';
const ip2 = '34.48.240.111';

function hw03() {
    let s = fs.createReadStream('./access.log', 'utf8')
        .pipe(es.split())
        .pipe(es.mapSync(function(line){
            s.pause();

            if (line.match(new RegExp(`^${ip1}`))) {
                writeToLog(line, 1);
                console.log(line);
            }
            if (line.match(new RegExp(`^${ip2}`))) {
                writeToLog('test'+line, 2);
                console.log(line);
            }

            s.resume();
        }))
        .on('error', function(err){
            console.log('Error while reading file.', err);
        })
        .on('end', function(){
            console.log('Read entire file.')
        });
}

function writeToLog (row, fileType) {
    let fileName = '';
    if (fileType === 1) {
        fileName = `./${ip1}_requests.log`;
    }
    else if (fileType === 2) {
        fileName = `./${ip2}_requests.log`;
    }

    const writeStream = fs.createWriteStream(fileName, { flags: 'a', encoding: 'utf8' });
    writeStream.write(row+'\n');

    writeStream.end(() => console.log(`${fileName} has been updated`));
}

module.exports = hw03;