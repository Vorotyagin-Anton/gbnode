const fs = require('fs');
const es = require('event-stream');

const ip1 = '89.123.1.41';
const ip2 = '34.48.240.111';

function hw03() {
    const writeStreamIp1 = fs.createWriteStream(`./${ip1}_requests.log`, { flags: 'a', encoding: 'utf8' });
    const writeStreamIp2 = fs.createWriteStream(`./${ip2}_requests.log`, { flags: 'a', encoding: 'utf8' });

    let s = fs.createReadStream('./access.log', 'utf8')
        .pipe(es.split())
        .pipe(es.mapSync(function(line){
            if (line.match(new RegExp(`^${ip1}`))) {
                writeStreamIp1.write(line+'\n');
                console.log(line);
            }
            if (line.match(new RegExp(`^${ip2}`))) {
                writeStreamIp2.write(line+'\n');
                console.log(line);
            }
        }))
        .on('error', function(err){
            console.log('Error while reading file.', err);
        })
        .on('end', function(){
            console.log('Read entire file.')
        });
}

module.exports = hw03;