fs-promise2 - fs module methode  as promises with nice error handler
=====================================================

fs module methode  as promises with nice error handler.
All fs-promise2 methods take the same argument as their namesake methode of fs module
https://nodejs.org/api/fs.html
http://sidsonaidson.github.io/fs-promise2/.

 * Tags: node.js, fs

##Installation
```
npm install fs-promise2
```

##Usage
``` javascript

let FileManager = require('fs-promise2');

let File = FileManager.File;
let ExceptionManager = FileManager.ExceptionManager;

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
```

##API
##Already Availaible method
```
fs.access,
fs.appendFile,
fs.chmod,
fs.chown,
fs.close,
fs.createReadStream,
fs.createWriteStream,
fs.exist,
fs.fchmod,
fs.fchown,
fs.fdatasync,
fs.fstat, fs.fsync,
fs.ftruncate,
fs.futimes, fs.lchmod,
fs.lchown,
fs.link,
fs.lstat,
fs.mkdir,
fs.mkdtemp,
fs.open,
fs.read,
fs.readdir,
fs.readFile,
fs.readlink,
fs.realpath,
fs.rename,
fs.stat,
fs.writeFile,
fs.write
// next soon
```

fs.write exist in 3 version in fs-promise2:
File.write,
File.WriteV002,
File.writeV0115;
https://nodejs.org/api/fs.html#fs_fs_write_fd_buffer_offset_length_position_callback
and
https://nodejs.org/api/fs.html#fs_fs_write_fd_string_position_encoding_callback

File.write use V002

##Exception
```
/**
 * Illegal argument type passed to function
 * @type {Error}
 */
ArgumentException
```
```
/**
 * The file or dir specified by path was not found.
 * @type {Error}
 */
DirectoryOrFileNotFoundException
```
```
/**
 * null args passed to function while expected not null
 * @type {Error}
 */
ArgumentNullException
```

```
/**
 * the directory doesn’t exist or it is on an unmapped drive.
 * @type {Error}
 */
DirectoryNotFoundException
```

```
/**
 * The file specified by path was not found.
 * @type {Error}
 */
FileNotFoundException
```

```
/**
 * An I/O error occurred while dealing with file.
 * @type {Error}
 */
IOException
```

```
/**
 * path exceeds the system-defined maximum length. For example, on Windows-based platforms,
 * paths must be less than 248 characters and file names must be less than 260 characters.
 * @type {Error}
 */
PathTooLongException
```

```
/**
 * path is in an invalid format.
 * @type {Error}
 */
NotSupportedException
```

```
/**
 * DirectoryWhileExpectedFileException, for example passing a directory to appendFile function
 * @type {Error}
 */
DirectoryWhileExpectedFileException
```

```
/**
 * FileWhileExpectedDirectoryException
 * @type {Error}
 */
FileWhileExpectedDirectoryException
```

```
/**
 * occured when path specifies a file that is read-only.
 * or have'nt access on file(no rigth)
 * or operation is not supported on the current platform.
 * @type {Error}
 */
UnauthorizedAccessException
```

### Resume

```
/**
 *
 * @param {String|Buffer} path - path of file
 * @param {Number} mode
 * @returns {"bluebird"|any}
 * @promise-error {ArgumentNullException}
 * @promise-error {ArgumentException}
 * @promise-error {FileNotFoundException}
 * @promise-error {PathTooLongException}
 * @promise-error {NotSupportedException}
 * @promise-error {SecurityException}
 * @promise-error {UnauthorizedAccessException}
 */
File.access
```

```
/**
 *
 * @param {Number|Buffer|String} file
 * @param data
 * @param options
 * @returns {"bluebird"|any}
 * @promise-error {ArgumentNullException}
 * @promise-error {ArgumentException}
 * @promise-error {IOException}
 * @promise-error {PathTooLongException}
 * @promise-error {NotSupportedException}
 * @promise-error {UnauthorizedAccessException}
 */
File.appendFile
```

```
/**
 *
 * @param {String|Buffer} path
 * @param {Number} mode
 * @returns {"bluebird"|any}
 * @promise-error {ArgumentNullException}
 * @promise-error {ArgumentException}
 * @promise-error {IOException}
 * @promise-error {PathTooLongException}
 * @promise-error {NotSupportedException}
 * @promise-error {UnauthorizedAccessException}
 * @promise-error {DirectoryNotFoundException}
 * @promise-error FileWhileExpectedDirectoryException
 */
File.chmod
```

```
/**
 *
 * @param {String|Buffer} path
 * @param {Number} uid
 * @param {Number} gid
 * @promise-error {PathTooLongException}
 * @promise-error {NotSupportedException}
 * @promise-error ArgumentNullException
 * @returns {"bluebird"|any}
 */
File.chown
```

```
/**
 *
 * @param {Number} fd
 * @returns {"bluebird"|any}
 * @promise-error {IOException}
 */
File.close
```

```
/**
 *
 * @param path
 * @param {Object|undefined, null} options
 * @returns {"bluebird"|any}
 * @promise-error {ArgumentNullException}
 * @promise-error {ArgumentException}
 */
File.createReadStream
```

```
/**
 *
 * @param path
 * @param {Object|undefined, null} options
 * @returns {"bluebird"|any}
 * @promise-error {ArgumentNullException}
 * @promise-error {ArgumentException}
 */
File.createWriteStream
```

```
/**
 *
 * @param {String|Buffer} path
 * @returns {"bluebird"|any}
 * @promise-error ArgumentNullException
 * @promise-error ArgumentException
 * @promise-error IOException
 * @promise-error {PathTooLongException}
 * @promise-error {NotSupportedException}
 */
File.exist
```

```
/**
 *
 * @param {String|Buffer} path
 * @param {Number} mode
 * @returns {"bluebird"|any}
 * @promise-error {ArgumentNullException}
 * @promise-error {ArgumentException}
 * @promise-error {IOException}
 * @promise-error {PathTooLongException}
 * @promise-error {NotSupportedException}
 * @promise-error {UnauthorizedAccessException}
 * @promise-error {DirectoryNotFoundException}
 */
File.fchmod
```

```
/**
 *
 * @param {String|Buffer} path
 * @param {Number} uid
 * @param {Number} gid
 * @returns {"bluebird"|any}
 * @promise-error ArgumentNullException
 * @promise-error ArgumentException
 * @promise-error FileNotFoundException
 * @promise-error IOException
 * @promise-error {PathTooLongException}
 * @promise-error {NotSupportedException}
 * @promise-error ArgumentNullException
 */
File.fchown
```

```
/**
 *
 * @param {Number} fd
 * @returns {"bluebird"|any}
 * @promise-error IOException
 * @promise-error ArgumentException
 */
File.fdatasync
```

```
/**
 *
 * @param {Number} fd
 * @returns {"bluebird"|any}
 * @promise-error IOException
 * @promise-error ArgumentException
 */
File.fstat
```

```
/**
 *
 * @param {Number} fd
 * @returns {"bluebird"|any}
 * @promise-error IOException
 * @promise-error ArgumentException
 */
File.fsync
```

```
/**
 *
 * @param {Number} fd
 * @param {Number} len
 * @returns {"bluebird"|any}
 * @promise-error ArgumentException
 * @promise-error IOException
 */
File.ftruncate
```

```
/**
 *
 * @param {Number} fd
 * @param {Number} atime
 * @param {Number} mtime
 * @returns {"bluebird"|any}
 * @promise-error IOException
 * @promise-error ArgumentException
 */
File.futimes
```

```
/**
 *
 * @param {Number} fd
 * @param {Number} mode
 * @returns {"bluebird"|any}
 * @promise-error IOException
 * @promise-error ArgumentException
 */
File.lchmod
```

```
/**
 *
 * @param {Number} fd
 * @param {Number} uid
 * @param {Number} gid
 * @returns {"bluebird"|any}
 * @promise-error IOException
 * @promise-error ArgumentException
 */
File.lchown
```

```
/**
 *
 * @param {String|Buffer} existingPath
 * @param {String|Buffer} newPath
 * @returns {"bluebird"|any}
 * @promise-error  {IOException}
 * @promise-error  {ArgumentException}
 * @promise-error {PathTooLongException}
 * @promise-error {NotSupportedException}
 * @promise-error {ArgumentNullException}
 */
File.link
```

```
/**
 *
 * @param {String|Buffer} path - path of file
 * @returns {"bluebird"|any}
 * @promise-error {ArgumentNullException}
 * @promise-error {ArgumentException}
 * @promise-error {FileNotFoundException}
 * @promise-error {PathTooLongException}
 * @promise-error {NotSupportedException}
 * @promise-error {UnauthorizedAccessException}
 * @promise-error {IOException}
 */
File.lstat
```
```
/**
 *
 * @param {String|Buffer} path - path of file
 * @param {Number} mode
 * @returns {"bluebird"|any}
 * @promise-error {ArgumentNullException}
 * @promise-error {ArgumentException}
 * @promise-error {FileNotFoundException}
 * @promise-error {PathTooLongException}
 * @promise-error {NotSupportedException}
 * @promise-error {UnauthorizedAccessException}
 * @promise-error {DirectoryNotFoundException}
 * @promise-error {IOException}
 */
File.mkdir
```

```
/**
 *
 * @param {String} prefix
 * @param {Object|String} options
 * @returns {"bluebird"|any}
 * @promise-error {ArgumentNullException}
 * @promise-error {ArgumentException}
 * @promise-error {PathTooLongException}
 * @promise-error {NotSupportedException}
 * @promise-error {IOException}
 */
File.mkdtemp
```

```
/**
 *
 * @param {String|Buffer} path
 * @param {String|Buffer} flags
 * @param {Number} mode
 * @returns {"bluebird"|any}
 * @promise-error DirectoryNotFoundException
 * @promise-error ArgumentException
 * @promise-error ArgumentNullException
 * @promise-error DirectoryNotFoundException
 * @promise-error FileNotFoundException
 * @promise-error {PathTooLongException}
 * @promise-error {NotSupportedException}
 */
File.open
```

```
/**
 *
 * @param {Number} fd
 * @param {Buffer} buffer
 * @param {Number} offset
 * @param {Number} length
 * @param {Number|null?} position
 * @returns {"bluebird"|any}
 * @promise-error ArgumentException
 * @promise-error IOException
 */
File.read
```

```
/**
 *
 * @param {String|Buffer} path - path of file
 * @param {String|Object} options
 * @returns {"bluebird"|any}
 * @promise-error {ArgumentNullException}
 * @promise-error {ArgumentException}
 * @promise-error {FileNotFoundException}
 * @promise-error {PathTooLongException}
 * @promise-error {NotSupportedException}
 * @promise-error {UnauthorizedAccessException}
 * @promise-error {DirectoryNotFoundException}
 * @promise-error {FileWhileExpectedDirectoryException}
 * @promise-error {IOException}
 */
File.readdir
```

```
/**
 *
 * @param {Number|Buffer|String} file
 * @param options
 * @returns {"bluebird"|any}
 * @promise-error {ArgumentNullException}
 * @promise-error {ArgumentException}
 * @promise-error {IOException}
 * @promise-error {PathTooLongException}
 * @promise-error {NotSupportedException}
 * @promise-error {UnauthorizedAccessException}
 * @promise-error {DirectoryWhileExpectedFileException}
 */
File.readFile
```

```
/**
 *
 * @param {String|Buffer} path - path of file
 * @param {String|Object} options
 * @returns {"bluebird"|any}
 * @promise-error {ArgumentNullException}
 * @promise-error {ArgumentException}
 * @promise-error {FileNotFoundException}
 * @promise-error {PathTooLongException}
 * @promise-error {NotSupportedException}
 * @promise-error {UnauthorizedAccessException}
 * @promise-error {DirectoryOrFileNotFoundException}
 * @promise-error {IOException}
 */
File.readlink
```

```
/**
 *
 * @param {String|Buffer} path
 * @returns {"bluebird"|any}
 * @promise-error {PathTooLongException}
 * @promise-error {NotSupportedException}
 */
File.realpath
```


```
/**
 *
 * @param {String|Buffer} existingPath
 * @param {String|Buffer} newPath
 * @returns {"bluebird"|any}
 * @promise-error  {IOException}
 * @promise-error  {ArgumentException}
 * @promise-error {PathTooLongException}
 * @promise-error {NotSupportedException}
 * @promise-error {ArgumentNullException}
 * @promise-error UnauthorizedAccessException
 * @promise-error FileNotFoundException
 */
File.rename
```

```
/**
 *
 * @param {String|Buffer} path
 * @returns {"bluebird"|any}
 * @promise-error ArgumentNullException
 * @promise-error ArgumentException
 * @promise-error IOException
 * @promise-error {PathTooLongException}
 * @promise-error {NotSupportedException}
 */
File.stat
```

```
/**
 *
 * @param {Number|Buffer|String} file
 * @param data
 * @param options
 * @returns {"bluebird"|any}
 * @promise-error {ArgumentNullException}
 * @promise-error {ArgumentException}
 * @promise-error {IOException}
 * @promise-error {PathTooLongException}
 * @promise-error {NotSupportedException}
 * @promise-error {UnauthorizedAccessException}
 */
File.writeFile
```

```
/**
 *
 * @param {Number} fd
 * @param {String} string
 * @param {Number|null?} position
 * @param {String} encoding
 * @returns {"bluebird"|any}
 * @promise-error ArgumentException
 * @promise-error IOException
 */
File.writeV0115
```

```
/**
 *
 * @param {Number} fd
 * @param {Buffer} buffer
 * @param {Number} offset
 * @param {Number} length
 * @param {Number|null?} position
 * @returns {"bluebird"|any}
 * @promise-error ArgumentException
 * @promise-error IOException
 */
File.writeV002
```

```
/**
 *
 * @param {Number} fd
 * @param {Buffer} buffer
 * @param {Number} offset
 * @param {Number} length
 * @param {Number|null?} position
 * @returns {"bluebird"|any}
 * @promise-error ArgumentException
 * @promise-error IOException
 */
File.write
```
