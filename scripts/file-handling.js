const fs = require('fs');

function readFile(filename) {
    const readableStream = fs.createReadStream(`./files/${filename}`, {
        encoding: 'utf8',
        highWaterMark: 64 * 1024 // 64 KB per chunk
    });

    readableStream.on('data', chunk => {
        console.log(`[System]: Received ${chunk.length} characters of data`);
    });

    readableStream.on('error', err => {
        console.error(`[System]: Error reading ${filename}`);
        console.error(`[System]: Error Code: ${err.code}`);
    });

    readableStream.on('end', () => {
        console.log(`[System]: Done Reading: ${filename}`);
    });

    return readableStream;
}

function writeFile(data, destName) {
    const writableStream = fs.createWriteStream(`./files/${destName}`);
    
    writableStream.on('error', err => {
        console.error('[System]: Write Error:', err);
    });

    writableStream.on('finish', () => {
        console.log('[System]: File Writing Completed.');
    });

    writableStream.write(data);
    writableStream.end();
}

module.exports = {
    readFile,
    writeFile
};
