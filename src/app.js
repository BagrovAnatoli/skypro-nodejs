const http = require('http');
const getUsers = require('./modules/users');
require('dotenv').config();

const port = process.env.PORT;
const host = process.env.HOST;

const getUsersResponse = (usersParam) => {
    if (!usersParam) {
        return {
            message: getUsers(),
            statusCode: 200,
            statusMessage: "OK",
            header: "Content-Type: application/json",
        };
    }
    return {
        message: "Enter a key 'users' without value",
        statusCode: 400,
        statusMessage: "Bad Request",
        header: "Content-Type: text/plain",
    };
}

const getHelloResponse = (helloParam) => {
    if (helloParam) {
        return {
            message: `Hello, ${helloParam}.`,
            statusCode: 200,
            statusMessage: "OK",
        };
    }
    return {
        message: "Enter a name",
        statusCode: 400,
        statusMessage: "Bad Request",
    };
}

const server = http.createServer((request, response) => {
    const addr = new URL(request.url, host);

    if (addr.pathname === '/') {
        if(addr.searchParams.get('users') !== null){
            const usersParam = addr.searchParams.get('users');
            const usersResponse = getUsersResponse(usersParam);
            response.statusCode = usersResponse.statusCode;
            response.statusMessage = usersResponse.statusMessage;
            response.header = usersResponse.header;
            response.write(usersResponse.message);
            response.end();
            return;
        }

        if(addr.searchParams.get('hello') !== null){
            console.log(`get('hello') !== null`);
            const helloParam = addr.searchParams.get('hello');
            const helloResponse = getHelloResponse(helloParam);
            response.statusCode = helloResponse.statusCode;
            response.statusMessage = helloResponse.statusMessage;
            response.header = "Content-Type: text/plain";
            response.write(helloResponse.message);
            response.end();
            return;
        }

        if(request.url === '/') {
            response.statusCode = 200;
            response.statusMessage = "OK";
            response.header = "Content-Type: text/plain";
            response.write("Hello, World!");
            response.end();
            return;
        }
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