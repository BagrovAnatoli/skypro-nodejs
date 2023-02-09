const urlMatchId = (url, path) => {
    let regex = null;
    if( path === 'books') regex = /\/books\/(?<id>\d{1,})/;
    if( path === 'users') regex = /\/users\/(?<id>\d{1,})/;
    if( path === 'delete-books') regex = /\/delete-books\/(?<id>\d{1,})/;
    if( path === 'delete-users') regex = /\/delete-users\/(?<id>\d{1,})/;
    const found = url.match(regex);
    return found?.groups.id;
}

exports.urlMatchId = urlMatchId;