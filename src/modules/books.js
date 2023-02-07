const fs = require('fs');
const path = require('path');
const { getLastBookId, incrementBookId } = require('./meta');

const filePath = path.join(__dirname, '../data/books.json');

const getBooks = () => {
    return fs.readFileSync(filePath);
}

const writeBooksFile = (array) => {
    fs.writeFile(filePath, JSON.stringify(array, null, 4), err => {
        if (err) throw err; 
        console.log("Done bookss writing");
    });
}

const getBookById = (id) => {
    const bookId = Number(id);
    console.log(id);
    console.log(bookId);
    const booksJSON = getBooks();
    const books = JSON.parse(booksJSON);
    const book = books.find(b => b.id === bookId);
    return book ? JSON.stringify(book) : "{}";
}

const urlMatchBookId = (url) => {
    const regex = /\/books\/(?<id>\d{1,})/;
    const found = url.match(regex);
    return found?.groups.id;
}

const addBook = (bodyJSON) => {
    const newBookInfo = JSON.parse(bodyJSON);
    newBookInfo.id = getLastBookId() + 1;
    newBookInfo.readBy = null;
    // прочитать файл
    const booksJSON = getBooks();
    // распарсить массив
    const books = JSON.parse(booksJSON);
    // добавить книгу
    books.push(newBookInfo);
    // записать в файл
    writeBooksFile(books);
    incrementBookId();
}

exports.getBooks = getBooks;
exports.getBookById = getBookById;
exports.urlMatchBookId = urlMatchBookId;
exports.addBook = addBook;
