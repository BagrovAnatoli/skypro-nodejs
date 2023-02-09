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

const editUser = (bodyJSON) => {
    const newUserInfo = JSON.parse(bodyJSON);
    const userId = newUserInfo.id;
    // прочитать файл
    const usersJSON = getUsers();
    // распарсить массив
    const users = JSON.parse(usersJSON);
    // найти пользователя и изменить его данные
    const updatedUsers = users.map((user) => {
        if (user.id === userId) {
            return {
                id: userId,
                firstname: newUserInfo.firstname,
                lastname: newUserInfo.lastname,
                phone: newUserInfo.phone,
                booksOnHand: newUserInfo.booksOnHand
            };
        }
        return user;
    });
    // записать в файл
    writeUsersFile(updatedUsers);
}

const deleteUser = (id) => {
    const userId = Number(id);
    const usersJSON = getUsers();
    const userss = JSON.parse(usersJSON);
    const updatedUsersList = users.filter((user) => {
        if (user.id === userId && user.booksOnHand.length === 0) {
            return false;
        }
        return true;
    });
    writeBooksFile(updatedBooksList);
}

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.addUser = addUser;
exports.editUser = editUser;
exports.deleteUser = deleteUser;
