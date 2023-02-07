const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/meta.json');

const getMetaInfo = () => {
    const fileContentJSON = fs.readFileSync(filePath);
    return JSON.parse(fileContentJSON);
}

const getLastUserId = () => {
    return getMetaInfo().lastUserId;
}

const getLastBookId = () => {
    return getMetaInfo().lastBookId;
}

const writeMetaInfo = (object) => {
    fs.writeFile(filePath, JSON.stringify(object, null, 4), err => {
        if (err) throw err; 
        console.log("Done meta writing");
    });
}

const incrementUserId = () => {
    const metaInfo = getMetaInfo();
    metaInfo.lastUserId++;
    writeMetaInfo(metaInfo);
}

const incrementBookId = () => {
    const metaInfo = getMetaInfo();
    metaInfo.lastBookId++;
    writeMetaInfo(metaInfo);
}

exports.incrementUserId = incrementUserId;
exports.incrementBookId = incrementBookId;
exports.getLastUserId = getLastUserId;
exports.getLastBookId = getLastBookId;