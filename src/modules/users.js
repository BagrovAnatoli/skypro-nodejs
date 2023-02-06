const fs = require('fs');
const path = require('path');

const getUsers = () => {
    const filePath = path.join(__dirname, '../data/users.json');
    return fs.readFileSync(filePath);
}

const getUserById = (id) => {
    const usersJSON = getUsers()
    const users = JSON.parse(usersJSON);
    const user = users.find(u => u.id === id);
    return JSON.stringify(user);
}

exports.getUsers = getUsers;
exports.getUserById = getUserById;