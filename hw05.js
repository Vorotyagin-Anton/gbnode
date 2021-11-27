const cluster = require('cluster');
const os = require('os');
const http = require('http');
const fs = require('fs');
const path = require('path');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        console.log(`Forking process number ${i}...`);
        cluster.fork();
    }
} else {
    console.log(`Worker ${process.pid} started...`);

    http.createServer((request, response) => {
        console.log(`Worker ${process.pid} handle this request...`);

        if (request.method === 'GET') {
            const listOfFilesInDirectory = fs.readdirSync('.');
            let filesInDirectoryHtml = ''
            listOfFilesInDirectory.forEach(fileName => filesInDirectoryHtml += `
                <a id="item" style="cursor: pointer; width: 200px;" onmouseover="this.style.color='orange';" onmouseout="this.style.color='';">${fileName}</a>
            `);

            const filePath = path.join(__dirname, 'index.html');
            let content = fs.readFileSync(filePath, {encoding:'utf8'});

            response.writeHead(200, { 'Content-Type': 'text/html'});
            response.end(content.replace('{{ CONTENT }}', filesInDirectoryHtml));
        } else if (request.method === 'POST') {
            let data = '';
            request.on('data', chunk => {
                data += chunk;
            });

            request.on('end', () => {
                const filePath = path.join(__dirname, data);
                let content = '';
                if (fs.lstatSync(filePath).isDirectory()) {
                    const listOfFilesInDirectory = fs.readdirSync(filePath);
                    listOfFilesInDirectory.forEach(fileName => content += `
                        <a id="item" style="cursor: pointer; width: 200px;" onmouseover="this.style.color='orange';" onmouseout="this.style.color='';">${data}/${fileName}</a>
                    `);
                }
                else {
                    content = fs.readFileSync(filePath, {encoding:'utf8'});
                }

                response.writeHead(200, { 'Content-Type': 'application/json'});
                response.end(JSON.stringify(content));
            });
        } else {
            response.statusCode = 405;
            response.end();
        }

    }).listen(3000, 'localhost');
}