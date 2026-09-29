# Node.js File Server

A simple file server built with Node.js core modules.

This project demonstrates how `http`, `url`, `events`, `fs`, and Node.js streams can work together without using Express or other web frameworks.

## Images
<img width="328" height="92" alt="Screenshot From 2026-09-29 16-35-03" src="https://github.com/user-attachments/assets/e4df24b9-f300-493a-811e-c95e73dc9a67" />
<img width="549" height="285" alt="Screenshot From 2026-09-29 16-35-11" src="https://github.com/user-attachments/assets/83e4299e-5475-46a7-907b-8ea7b51110dd" />
<img width="390" height="31" alt="Screenshot From 2026-09-29 16-35-34" src="https://github.com/user-attachments/assets/89067c41-2603-4438-8589-527a71b5895f" />
<img width="267" height="29" alt="Screenshot From 2026-09-29 16-35-54" src="https://github.com/user-attachments/assets/ab890246-a845-4d8a-9258-9e4ff883aa60" />


## Features

* HTTP server using Node.js `http`
* URL and query parameter parsing
* Read files using readable streams
* Create and write files using writable streams
* Event-driven file operations using `EventEmitter`
* No Express or external web framework
* Simple HTTP endpoints for reading and writing files

## Project Structure

```text
project/
├── server.js
├── scripts/
│   └── file-handling.js
└── README.md
```

## Requirements

* Node.js 18 or newer
* A terminal
* A web browser or tool such as curl

Check your Node.js version:

```bash
node --version
```

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Enter the project directory:

```bash
cd <project-directory>
```

No npm packages are required because the project uses Node.js built-in modules.

## Running the Server

Start the server with:

```bash
node server.js
```

You should see:

```text
Server is running on http://localhost:3000
```

The server runs on port `3000`.

## Endpoints

### Home

Request:

```text
GET /
```

Example:

```text
http://localhost:3000/
```

Response:

```text
Welcome to the File Server
```

## Writing a File

The `/write` endpoint creates a file and writes data into it.

Format:

```text
/write?file=FILE_NAME&data=DATA
```

Example:

```text
http://localhost:3000/write?file=test.txt&data=Hello%20World
```

This creates:

```text
test.txt
```

with:

```text
Hello World
```

The server uses a writable stream to write the data.

### Using curl

```bash
curl "http://localhost:3000/write?file=test.txt&data=Hello%20World"
```

Response:

```text
Successfully wrote data to test.txt
```

## Reading a File

The `/read` endpoint reads an existing file.

Format:

```text
/read?file=FILE_NAME
```

Example:

```text
http://localhost:3000/read?file=test.txt
```

The server creates a readable stream and sends the file contents to the HTTP response.

### Using curl

```bash
curl "http://localhost:3000/read?file=test.txt"
```

Output:

```text
Hello World
```

## How the Project Works

The project is built around several Node.js core concepts.

### HTTP

The `http` module creates the web server.

```js
const http = require('http');
```

The server receives a request and sends a response:

```js
const server = http.createServer((req, res) => {
    // Handle request
});
```

### URL

The `url` module is used to separate the URL path from its query parameters.

For example:

```text
/write?file=test.txt&data=Hello
```

The pathname is:

```text
/write
```

The query parameters are:

```text
file = test.txt
data = Hello
```

### EventEmitter

`EventEmitter` allows different parts of the application to communicate through events.

```js
const EventEmitter = require('events');

const serverEmitter = new EventEmitter();
```

File operations are registered as event listeners:

```js
serverEmitter.on('read-File', readFile);
serverEmitter.on('write-File', writeFile);
```

The write operation can then be triggered with:

```js
serverEmitter.emit('write-File', filename, data);
```

### File System

The `fs` module provides access to the file system.

```js
const fs = require('fs');
```

The project uses:

```js
fs.createReadStream()
```

for reading files and:

```js
fs.createWriteStream()
```

for writing files.

### Readable Streams

A readable stream reads data in chunks instead of loading the entire file into memory.

```js
const readableStream = fs.createReadStream(filename, {
    encoding: 'utf8',
    highWaterMark: 64 * 1024
});
```

The `data` event is triggered whenever a new chunk is available:

```js
readableStream.on('data', chunk => {
    console.log(chunk);
});
```

The `end` event is triggered when reading is complete:

```js
readableStream.on('end', () => {
    console.log('Done reading');
});
```

### Writable Streams

A writable stream allows data to be written to a file.

```js
const writableStream = fs.createWriteStream(destName);

writableStream.write(data);
writableStream.end();
```

The `finish` event is triggered after all data has been written:

```js
writableStream.on('finish', () => {
    console.log('File writing completed');
});
```

## Data Flow

A write request follows this process:

```text
Browser / curl
      |
      v
HTTP Server
      |
      v
URL Parser
      |
      v
/ write route
      |
      v
EventEmitter
      |
      v
writeFile()
      |
      v
Writable Stream
      |
      v
File
```

A read request follows this process:

```text
Browser / curl
      |
      v
HTTP Server
      |
      v
URL Parser
      |
      v
/ read route
      |
      v
readFile()
      |
      v
Readable Stream
      |
      v
HTTP Response
      |
      v
Browser / curl
```

## Error Handling

The file handling module listens for stream errors.

For reading:

```js
readableStream.on('error', err => {
    console.error(`[System]: Read Error: ${err.code}`);
});
```

For writing:

```js
writableStream.on('error', err => {
    console.error(`[System]: Write Error: ${err.code}`);
});
```

The server also checks whether the required query parameters were provided.

For example:

```text
/write
```

without a filename or data returns:

```text
Missing file or data parameter
```

## Important Notes

This project is designed for learning Node.js core modules.

It is not intended to be used as a production file server.

The current implementation accepts file names from the URL. A production application should validate and restrict file paths to prevent users from accessing files outside an intended directory.

The `/write` endpoint can also overwrite an existing file with the same name.

## Technologies

* Node.js
* HTTP
* URL
* EventEmitter
* File System
* Readable Streams
* Writable Streams

## Learning Goals

This project is useful for understanding:

* How Node.js HTTP servers work
* How requests and responses work
* How URLs and query parameters are parsed
* How EventEmitter works
* How Node.js handles files
* How readable streams work
* How writable streams work
* How streams can send data without loading an entire file into memory
* How Node.js core modules can be combined to build a small application

## License

This project is available for learning and personal use.

