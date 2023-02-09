const http = require('http');
const { urlMatchId } = require('./modules/urlMatchId');
const { getUsers, getUserById, addUser, editUser, deleteUser } = require('./modules/users');
const { getBooks, getBookById, addBook, editBook, takeBook, returnBook, deleteBook } = require('./modules/books');

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

const bodyPUTProcessing = (body, url) => {
    console.log(url);
    console.log(body);
    if (url === '/edit-user') {
        console.log('Редактировать пользователя');
        editUser(body);
    }
    if (url === '/edit-book') {
        console.log('Редактировать книгу');
        editBook(body);
    }
    if (url === '/take-book') {
        console.log('Взять книгу');
        takeBook(body);
    }
    if (url === '/return-book') {
        console.log('Вернуть книгу');
        returnBook(body);
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

    if (request.method === 'PUT') {
        let body = '';
        request.on('data', chunk => {
            body += chunk.toString();
        });
        request.on('end', () => {
            bodyPUTProcessing(body, request.url);
            response.end('ok');
        });
        return;
    }

    if (request.method === 'DELETE') {
        const foundBookId = urlMatchId(request.url, 'delete-book');
        const foundUserId = urlMatchId(request.url, 'delete-user');
        if (foundBookId) {
            deleteBook(foundBookId);
        }
        if (foundUserId) {
            deleteUser(foundUserId);
        }
        response.end('ok');
    }

    if (request.method === 'GET') {
        const foundUserId = urlMatchId(request.url, 'users');
        const foundBookId = urlMatchId(request.url, 'books');

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
    }

});

server.listen(port, () => {
    console.log(`Сервер запущен по адресу http://${host}:${port}`);
});