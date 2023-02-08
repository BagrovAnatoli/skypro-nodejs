const fs = require('fs');
const path = require('path');
const { getLastBookId, incrementBookId } = require('./meta');
const { getUserById, editUser } = require('./users');

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


const editBook = (bodyJSON) => {
    const newBookInfo = JSON.parse(bodyJSON);
    const bookId = newBookInfo.id;
    // прочитать файл
    const booksJSON = getBooks();
    // распарсить массив
    const books = JSON.parse(booksJSON);
    // найти книгу и изменить её данные
    const updatedBooks = books.map((book) => {
        if (book.id === bookId) {
            return {
                id: bookId,
                author: newBookInfo.author,
                title: newBookInfo.title,
                genre: newBookInfo.genre,
                tome: newBookInfo.tome,
                readBy: newBookInfo.readBy,
            };
        }
        return book;
    });
    // записать в файл
    writeBooksFile(updatedBooks);
}

const takeBook = (bodyJSON) => {
    // {
    //     userId: 1,
    //     bookId: 1,
    //     dateReturn: "20.02.2023"
    // }
    const takingInfo = JSON.parse(bodyJSON);
    const { bookId, userId, dateReturn } = takingInfo;

    const bookJSON = getBookById(bookId);
    const book = JSON.parse(bookJSON);
    if (book.readBy) {return;}
    book.readBy = userId;
    editBook(JSON.stringify(book));

    const userJSON = getUserById(userId);
    const user = JSON.parse(userJSON);
    user.booksOnHand.push({
        id: bookId,
        dateReturn
    });
    editUser(JSON.stringify(user));
}

const clearBookFromUser = (bookId, userId) => {
    const userJSON = getUserById(userId);
    const user = JSON.parse(userJSON);
    const newBooksOnHand = user.booksOnHand.filter((item) => {
        return item.id !== bookId;
    });
    user.booksOnHand = newBooksOnHand;
    editUser(JSON.stringify(user));
}

const returnBook = (bodyJSON) => {
    // {
    //     bookId: 1,
    // }
    const { bookId } = JSON.parse(bodyJSON);

    const bookJSON = getBookById(bookId);
    const book = JSON.parse(bookJSON);
    const userId = book.readBy;
    book.readBy = null;
    editBook(JSON.stringify(book));

    clearBookFromUser(bookId, userId);
}

const deleteBook = (id) => {
    const bookId = Number(id);
    const booksJSON = getBooks();
    const books = JSON.parse(booksJSON);
    const updatedBooksList = books.filter((book) => {
        if (book.id === bookId) {
            if (book.readBy) {
                clearBookFromUser(bookId, book.readBy);
            }
            return false;
        }
        return true;
    });
    writeBooksFile(updatedBooksList);
}

exports.getBooks = getBooks;
exports.getBookById = getBookById;
exports.addBook = addBook;
exports.editBook = editBook;
exports.takeBook = takeBook;
exports.returnBook = returnBook;
exports.deleteBook = deleteBook;
