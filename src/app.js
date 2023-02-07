const http = require('http');
const { getUsers, getUserById } = require('./modules/users');

const port = 3003;
const host = '127.0.0.1';

const server = http.createServer((request, response) => {
    const addr = new URL(request.url, 'http://127.0.0.1');

    const regex = /\/users\/(?<id>\d{1,})/;
    const found = request.url.match(regex);
    const foundId = found?.groups.id;

    if (request.url === '/users') {
        response.statusCode = 200;
        response.statusMessage = "OK";
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.write(getUsers());
        response.end();
        return;
    }

    if (foundId) {
        response.statusCode = 200;
        response.statusMessage = "OK";
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        // response.write(foundId);
        response.write(getUserById(foundId), "utf8");
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