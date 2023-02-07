const fs = require('fs');
const path = require('path');
const { getLastUserId, incrementUserId } = require('./meta');

const filePath = path.join(__dirname, '../data/users.json');

const getUsers = () => {
    return fs.readFileSync(filePath);
}

const writeUsersFile = (array) => {
    fs.writeFile(filePath, JSON.stringify(array, null, 4), err => {
        if (err) throw err; 
        console.log("Done users writing");
    });
}

const getUserById = (id) => {
    const userId = Number(id);
    console.log(id);
    console.log(userId);
    const usersJSON = getUsers();
    const users = JSON.parse(usersJSON);
    const user = users.find(u => u.id === userId);
    return user ? JSON.stringify(user) : "{}";
}

const urlMatchUserId = (url) => {
    const regex = /\/users\/(?<id>\d{1,})/;
    const found = url.match(regex);
    return found?.groups.id;
}

const addUser = (bodyJSON) => {
    const newUserInfo = JSON.parse(bodyJSON);
    newUserInfo.id = getLastUserId() + 1;
    newUserInfo.booksOnHand = [];
    // прочитать файл
    const usersJSON = getUsers();
    // распарсить массив
    const users = JSON.parse(usersJSON);
    // добавить пользователя
    users.push(newUserInfo);
    // записать в файл
    writeUsersFile(users);
    incrementUserId();
}

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.urlMatchUserId = urlMatchUserId;
exports.addUser = addUser;
