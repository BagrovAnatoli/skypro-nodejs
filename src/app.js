const http = require('http');
const { getUsers, getUserById, urlMatchUserId, addUser } = require('./modules/users');
const { getBooks, getBookById, urlMatchBookId, addBook } = require('./modules/books');

const port = 3003;
const host = '127.0.0.1';

const bodyPOSTProcessing = (body, url) => {
    console.log(url);
    console.log(body);
    if (url === '/add-user') {
        console.log('Добавить пользователя');
        addUser(body);
    }
    if (url === '/add-book') {
        console.log('Добавить книгу');
        addBook(body);
    }
}

const server = http.createServer((request, response) => {
    const addr = new URL(request.url, 'http://127.0.0.1');

    if (request.method === 'POST') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            bodyPOSTProcessing(body, request.url);
            response.end('ok');
        });
        return;
    }

    const foundUserId = urlMatchUserId(request.url);
    const foundBookId = urlMatchBookId(request.url);

    if (request.url === '/users') {
        response.statusCode = 200;
        response.statusMessage = "OK";
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.write(getUsers());
        response.end();
        return;
    }

    if (request.url === '/books') {
        response.statusCode = 200;
        response.statusMessage = "OK";
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.write(getBooks());
        response.end();
        return;
    }

    if (foundUserId) {
        response.statusCode = 200;
        response.statusMessage = "OK";
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.write(getUserById(foundUserId), "utf8");
        response.end();
        return;
    }

    if (foundBookId) {
        response.statusCode = 200;
        response.statusMessage = "OK";
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.write(getBookById(foundBookId), "utf8");
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