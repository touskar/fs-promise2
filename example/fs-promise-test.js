
let FileManager = require('fs-promise2');

let File = FileManager.File;
let ExceptionManager = FileManager.ExceptionManager;
fs = require('fs')

File.appendFile('hello.txt')
    .then((buffer) => {
        console.log(`Data added to file`, buffer);
    })
    .catch(ExceptionManager.ArgumentNullException, (e) => {
        console.log(`Null args passed to function`, e);
    })
    .catch(ExceptionManager.ArgumentException, (e) => {
        console.log(`illegal args passed to function`, e);
    })
    .catch(ExceptionManager.PathTooLongException, (e) => {
        console.log(`path exceeds the system-defined maximum length.`, e);
    })
    .catch(ExceptionManager.NotSupportedException, (e) => {
        console.log(`path is in an invalid format.`, e);
    })
    .catch(ExceptionManager.UnauthorizedAccessException, (e) => {
        console.log(`no rigth on file`, e);
    })
    .catch(ExceptionManager.IOException, (e) => {
        console.log(`io problem`, e);
    })
    .catch((e) => {
        console.log(e);
    });


