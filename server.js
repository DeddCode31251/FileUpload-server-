const http = require('http');
const EventEmitter = require('events');
const url = require('url');

const { writeFile, readFile } = require('./scripts/file-handling.js');

const serverEmitter = new EventEmitter();

serverEmitter.on('read-File', readFile);
serverEmitter.on('write-File', writeFile);

const server = http.createServer((req, res) => {

    const parsedUrl = url.parse(req.url, true);

    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    if (pathname === '/read') {

        const filename = query.file;

        if (!filename) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            });

            return res.end('Missing file parameter');
        }

        const readableStream = readFile(filename);

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });

        readableStream.pipe(res);

        return;
    }

    if (pathname === '/write') {

        const filename = query.file;
        const data = query.data;

        if (!filename || !data) {
            res.writeHead(400, {
                'Content-Type': 'text/plain'
            });

            return res.end('Missing file or data parameter');
        }

        serverEmitter.emit('write-File', filename, data);

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });

        return res.end(`Successfully wrote data to ${filename}`);
    }

    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });

    res.end('Welcome to the File Server');
});

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
