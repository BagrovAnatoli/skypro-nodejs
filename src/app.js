const http = require('http');
const { getUsers, getUsers2 } = require('./modules/users');

const port = 3003;
const host = '127.0.0.1';

const server = http.createServer((request, response) => {
    const addr = new URL(request.url, 'http://127.0.0.1');

    if (request.url === '/users') {
        response.statusCode = 200;
        response.statusMessage = "OK";
        response.header = "Content-Type: application/json";
        response.write(getUsers());
        response.end();
        return;
    }

    if (request.url === '/users2') {
        response.statusCode = 200;
        response.statusMessage = "OK";
        response.header = "Content-Type: application/json";
        response.write(getUsers2());
        response.end();
        return;
    }

    response.statusCode = 500;
    response.statusMessage = "Internal Server Eror";
    response.header = "Content-Type: text/plain";
    response.write(" ");
    response.end();

});

server.listen(port, () => {
    console.log(`Сервер запущен по адресу http://${host}:${port}`);
});