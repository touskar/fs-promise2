let BPromise = require("bluebird");
let fs = require('fs');

let File = Object.create({});
let pathUtil = require('path');
let os = require('os');
let FileManager = module.exports;
let ExceptionManager = require("./exception.js");
let UtilityManager = require("./utility.js");

FileManager.File = File;
FileManager.ExceptionManager = ExceptionManager;

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
 */
File.access = (path, mode) => {
    return new BPromise((resolve, reject) => {
        if(typeof path !== 'string' &&  Buffer.isBuffer(path) === false)
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof path} passed as firs arg, Number|String|Buffer expected`));
        }
        else{
            try{
                UtilityManager.isValidPath(String(path))
            }
            catch(e){
                reject(e);
                return;
            }

            if(!Number.isInteger(mode))
            {
                reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof mode} passed as arg for mode, Number expected`));
            }
            else{
                fs.access(path, mode, (err) => {
                    if(err)
                    {
                        if (err.code === "ENOENT")
                        {
                            reject(new ExceptionManager.FileNotFoundException(`FileNotFoundException: file '${pathUtil.resolve(path)}' not Found or don't exist`));
                        }
                        else{
                            reject(new ExceptionManager.UnauthorizedAccessException(`UnauthorizedAccessException: have no access on '${pathUtil.resolve(path)}`, err))
                        }
                    }
                    else{
                        console.log(path)
                        resolve(path);
                    }
                })

            }
        }
    });
};

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
File.appendFile = (file, data,options) => {
    return new BPromise((resolve, reject) => {
         if(data === null || file === null)
        {
            reject(ExceptionManager.ArgumentNullException(`ArgumentNullException: data or file args is null`));
        }
        else if(!Number.isInteger(file) && typeof file !== 'string' &&  Buffer.isBuffer(file) === false)
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof mode} passed as firs arg, Number|String|Buffer expected`));
        }


        if(typeof file === 'string' ||  Buffer.isBuffer(file) === false)
        {
            UtilityManager.isValidPath(String(file));
        }


        fs.access(file, fs.constants.W_OK, (err) => {
            if(err)
            {
                if(err.code === "ENOENT")
                {
                    fs.writeFile(file, '',(err) => {
                        if(err)
                        {
                            reject(new ExceptionManager.IOException(`IOException: I/O exception occured while opening '${file}' file`, err))
                        }
                        else{
                            fs.access(file, fs.constants.R_OK | fs.constants.W_OK, (err) => {
                                if(err)
                                {
                                    reject(new ExceptionManager.UnauthorizedAccessException(`UnauthorizedAccessException: have no access `))
                                }
                                else{
                                    fs.stat(file, (err, stats) => {
                                        if(err)
                                        {
                                            reject(new ExceptionManager.IOException(`IOException: I/O exception occured while opening '${file}' file`, err))
                                        }
                                            else  if(stats.isDirectory())
                                        {
                                            reject(new ExceptionManager.DirectoryWhileExpectedFileException(`DirectoryWhileExpectedFileException: '${file}' is a Directory`))
                                        }
                                        else {
                                            fs.appendFile(file, data,options, (err) => {
                                                if (err){
                                                    reject(new ExceptionManager.IOException(`IOException: I/O exception occured while writing '${file}' file`, err))
                                                }
                                                resolve(Buffer.from(String(data)));
                                            });
                                        }
                                    });
                                }
                            });

                        }
                    });
                }
                else{
                    reject(new ExceptionManager.UnauthorizedAccessException(`UnauthorizedAccessException: have no access `))
                }
            }
            else{
                fs.appendFile(file, data,options, (err) => {
                    if (err){
                        reject(new ExceptionManager.IOException(`IOException: I/O exception occured while writing '${file}' file`, err))
                    }
                    resolve(Buffer.from(String(data)));
                });
            }
        });

    });
};

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
File.chmod = (path, mode) => {
    return new BPromise((resolve, reject) => {
        if(path === null || mode === null)
        {
            reject(ExceptionManager.ArgumentNullException(`ArgumentNullException: data or mode are null`));
        }
        else if(typeof path !== 'string' &&  Buffer.isBuffer(path) === false)
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof path} passed as firs arg, Number|String|Buffer expected`));
        }
        else if(!Number.isInteger(mode))
        {

            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof mode} passed as second arg, Number expected`));
        }
        else{

            try {
                UtilityManager.isValidPath(String(path));
            } catch (e) {
                throw e;
            }

            fs.access(path, fs.constants.F_OK, (err) => {

                if(err)
                {
                    if(err.code === "ENOENT")
                    {
                        reject(new ExceptionManager.DirectoryNotFoundException(`DirectoryNotFoundException: '${pathUtil.resolve(path)}' not Found or don't exist`));
                    }
                    else{

                        reject(new ExceptionManager.IOException(`IOException: I/O exception occured while writing '${path}' file`, err))
                    }
                }
                else{

                    fs.stat(path, (err, stats) => {

                        if(err)
                        {
                            reject(new ExceptionManager.IOException(`IOException: I/O exception occured while opening '${path}' file`, err))
                        }
                        //else  if(stats.isFile())
                        //{
                        //    reject(new ExceptionManager.FileWhileExpectedDirectoryException(`FileWhileExpectedDirectoryException: '${path}' is a Directory`))
                        //}
                        else{

                            fs.chmod(path, mode, (err) => {
                                if(err)
                                {
                                    reject(new ExceptionManager.IOException(`IOException: I/O exception occured while dealing with '${path}' file`, err))
                                }
                                else{
                                    resolve(path);
                                }
                            })
                        }
                    })
                }
            });



        }



    });
};

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
File.chown = (path, uid, gid) => {
    return new BPromise((resolve, reject) => {

        if(path === null || uid === null || gid === null)
        {
            reject(new ExceptionManager.ArgumentNullException(`ArgumentNullException: path or uid, gid args are null`));
        }
        else if(typeof path !== 'string' &&  Buffer.isBuffer(path) === false)
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof path} passed as firs arg, Number|String|Buffer expected`));
        }
        else if(!Number.isInteger(uid) || !Number.isInteger(gid))
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof uid} or ${typeof gid} passed as  arg for uid or gid, Number expected`));
        }
        else{

            try {
                UtilityManager.isValidPath(String(path));
            } catch (e) {
                throw e;
            }

            fs.access(path, fs.constants.F_OK, (err) => {

                if(err)
                {
                    if(err.code === "ENOENT")
                    {
                        reject(new ExceptionManager.FileNotFoundException(`FileNotFoundException: '${pathUtil.resolve(path)}' not Found or don't exist`));
                    }
                    else{
                        reject(new ExceptionManager.IOException(`IOException: I/O exception occured while writing '${path}' file`, err))
                    }
                }
                else{

                    fs.stat(path, (err, stats) => {

                        if(err)
                        {
                            reject(new ExceptionManager.IOException(`IOException: I/O exception occured while opening '${path}' file`))
                        }
                        //else if(stats.isFile())
                        //{
                        //    reject(new ExceptionManager.DirectoryWhileExpectedFileException(`DirectoryWhileExpectedFileException: '${path}' is a Directory`))
                        //
                        //}
                        else{

                            fs.chown(path, uid, gid, (err) => {
                                if(err)
                                {
                                    reject(new ExceptionManager.IOException(`IOException: I/O exception occured while dealing with '${path}' file`, err))
                                }
                                else{
                                    resolve(path);
                                }
                            })
                        }
                    })
                }
            });



        }



    });

};

/**
 *
 * @param {Number} fd
 * @returns {"bluebird"|any}
 * @promise-error {IOException}
 */
File.close = (fd) => {
    return new BPromise((resolve, reject) => {
        if(!Number.isInteger(fd))
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof fd} passed as arg for fd, Number expected`));
        }
        else{
            fs.close(fs, (err) => {
                if(err)
                {
                    reject(new ExceptionManager.IOException(`IOException: I/O exception occured while dealing with '${fd}' file`, err));
                }
                else{
                    resolve(fd);
                }
            })
        }
    });
};

/**
 *
 * @param path
 * @param {Object|undefined, null} options
 * @returns {"bluebird"|any}
 * @promise-error {ArgumentNullException}
 * @promise-error {ArgumentException}
 */
File.createReadStream = (path,options) => {
    return new BPromise((resolve, reject) => {
        if(path === null )
        {
            reject(new ExceptionManager.ArgumentNullException(`ArgumentNullException: path or uid, gid args are null`));
        }
        else if(typeof path !== 'string' &&  Buffer.isBuffer(path) === false)
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof path} passed as firs arg, Number|String|Buffer expected`));
        }

        resolve(fs.createReadStream(path, options));

    });
};


/**
 *
 * @param path
 * @param {Object|undefined, null} options
 * @returns {"bluebird"|any}
 * @promise-error {ArgumentNullException}
 * @promise-error {ArgumentException}
 */
File.createWriteStream = (path,options) => {
    return new BPromise((resolve, reject) => {
        if(path === null )
        {
            reject(new ExceptionManager.ArgumentNullException(`ArgumentNullException: path or uid, gid args are null`));
        }
        else if(typeof path !== 'string' &&  Buffer.isBuffer(path) === false)
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof path} passed as firs arg, Number|String|Buffer expected`));
        }

        resolve(fs.createReadStream(path, options));

    });
};

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
File.exist = (path) => {
    return new BPromise((resolve, reject) => {
        if(path === null )
        {
            reject(new ExceptionManager.ArgumentNullException(`ArgumentNullException: path or uid, gid args are null`));
        }
        else if(typeof path !== 'string' &&  Buffer.isBuffer(path) === false)
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof path} passed as firs arg, Number|String|Buffer expected`));
        }
        try {
            UtilityManager.isValidPath(String(path));
        } catch (e) {
            throw e;
        }

        fs.access(path, fs.constants.F_OK, (err) => {
            if(err)
            {
                if(err.code === "ENOENT")
                {
                    resolve(false);
                }
                else{
                    reject(new ExceptionManager.IOException(`IOException: I/O exception occured while writing '${path}' file`, err))
                }
            }
            else{
                resolve(true);
            }
        });

    });
};

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
File.fchmod = (path, mode) => {
    return new BPromise((resolve, reject) => {
        if(path === null || mode === null)
        {
            reject(ExceptionManager.ArgumentNullException(`ArgumentNullException: data or mode are null`));
        }
        else if(typeof path !== 'string' &&  Buffer.isBuffer(path) === false)
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof path} passed as firs arg, Number|String|Buffer expected`));
        }
        else if(!Number.isInteger(mode))
        {

            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof mode} passed as second arg, Number expected`));
        }
        else{

            try {
                UtilityManager.isValidPath(String(path));
            } catch (e) {
                throw e;
            }

            fs.access(path, fs.constants.F_OK, (err) => {

                if(err)
                {
                    if(err.code === "ENOENT")
                    {
                        reject(new ExceptionManager.DirectoryNotFoundException(`DirectoryNotFoundException: '${pathUtil.resolve(path)}' not Found or don't exist`));
                    }
                    else{

                        reject(new ExceptionManager.IOException(`IOException: I/O exception occured while writing '${path}' file`, err))
                    }
                }
                else{

                    fs.stat(path, (err, stats) => {

                        if(err)
                        {
                            reject(new ExceptionManager.IOException(`IOException: I/O exception occured while opening '${path}' file`, err))
                        }
                        //else  if(stats.isDirectory())
                        //{
                        //    reject(new ExceptionManager.DirectoryWhileExpectedFileException(`DirectoryWhileExpectedFileException: '${path}' is a Directory`))
                        //}
                        else{

                            fs.chmod(path, mode, (err) => {
                                if(err)
                                {
                                    reject(new ExceptionManager.IOException(`IOException: I/O exception occured while dealing with '${path}' file`, err))
                                }
                                else{
                                    resolve(path);
                                }
                            })
                        }
                    })
                }
            });



        }



    });
};

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
File.fchown = (path, uid, gid) => {
    return new BPromise((resolve, reject) => {

        if(path === null || uid === null || gid === null)
        {
            reject(new ExceptionManager.ArgumentNullException(`ArgumentNullException: path or uid, gid args are null`));
        }
        else if(typeof path !== 'string' &&  Buffer.isBuffer(path) === false)
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof path} passed as firs arg, Number|String|Buffer expected`));
        }
        else if(!Number.isInteger(uid) || !Number.isInteger(gid))
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof uid} or ${typeof gid} passed as  arg for uid or gid, Number expected`));
        }
        else{

            try {
                UtilityManager.isValidPath(String(path));
            } catch (e) {
                throw e;
            }

            fs.access(path, fs.constants.F_OK, (err) => {

                if(err)
                {
                    if(err.code === "ENOENT")
                    {
                        reject(new ExceptionManager.FileNotFoundException(`FileNotFoundException: '${pathUtil.resolve(path)}' not Found or don't exist`));
                    }
                    else{
                        reject(new ExceptionManager.IOException(`IOException: I/O exception occured while writing '${path}' file`, err))
                    }
                }
                else{

                    fs.stat(path, (err, stats) => {

                        if(err)
                        {
                            reject(new ExceptionManager.IOException(`IOException: I/O exception occured while opening '${path}' file`))
                        }
                        //else if(stats.isDirectory())
                        //{
                        //    reject(new ExceptionManager.DirectoryWhileExpectedFileException(`DirectoryWhileExpectedFileException: '${path}' is a Directory`))
                        //
                        //}
                        else{

                            fs.chown(path, uid, gid, (err) => {
                                if(err)
                                {
                                    reject(new ExceptionManager.IOException(`IOException: I/O exception occured while dealing with '${path}' file`, err))
                                }
                                else{
                                    resolve(path);
                                }
                            })
                        }
                    })
                }
            });

        }

    });

};

/**
 *
 * @param {Number} fd
 * @returns {"bluebird"|any}
 * @promise-error IOException
 * @promise-error ArgumentException
 */
File.fdatasync = (fd) => {
    return new BPromise((resolve, reject) => {
        if(!Number.isInteger(fd))
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof fd} passed as arg for fd, Number expected`));
        }
        else{
            fs.fdatasync(fd, (err) => {
                if(err)
                {
                    reject(new ExceptionManager.IOException(`IOException: I/O exception occured while dealing with '${fd}' file`, err));
                }
                else{
                    resolve(fd);
                }
            })
        }
    });
};

/**
 *
 * @param {Number} fd
 * @returns {"bluebird"|any}
 * @promise-error IOException
 * @promise-error ArgumentException
 */
File.fstat = (fd) => {
    return new BPromise((resolve, reject) => {
        if(!Number.isInteger(fd))
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof fd} passed as arg for fd, Number expected`));
        }
        else{
            fs.fstat(fd, (err, stats) => {
                if(err)
                {
                    reject(new ExceptionManager.IOException(`IOException: I/O exception occured while dealing with '${fd}' file`, err));
                }
                else{
                    resolve(stats);
                }
            })
        }
    });
};

/**
 *
 * @param {Number} fd
 * @returns {"bluebird"|any}
 * @promise-error IOException
 * @promise-error ArgumentException
 */
File.fsync = (fd) => {
    return new BPromise((resolve, reject) => {
        if(!Number.isInteger(fd))
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof fd} passed as arg for fd, Number expected`));
        }
        else{
            fs.fsync(fd, (err) => {
                if(err)
                {
                    reject(new ExceptionManager.IOException(`IOException: I/O exception occured while dealing with '${fd}' file`, err));
                }
                else{
                    resolve(fd);
                }
            })
        }
    });
};

/**
 *
 * @param {Number} fd
 * @param {Number} len
 * @returns {"bluebird"|any}
 * @promise-error ArgumentException
 * @promise-error IOException
 */
File.ftruncate = (fd, len) => {
    return new BPromise((resolve, reject) => {
        if(!Number.isInteger(fd))
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof fd} passed as arg for fd, Number expected`));
        }
        else{
            if(typeof len === "undefined")
            {
                len = 0;
            }

            if(!Number.isInteger(len))
            {
                reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof fd} passed as arg for fd, Number expected`));
            }
            else{
                fs.ftruncate(fd,len, (err) => {
                    if(err)
                    {
                        reject(new ExceptionManager.IOException(`IOException: I/O exception occured while dealing with '${fd}' file`, err));
                    }
                    else{
                        resolve(fd);
                    }
                })
            }
        }

    });
};


/**
 *
 * @param {Number} fd
 * @param {Number} atime
 * @param {Number} mtime
 * @returns {"bluebird"|any}
 * @promise-error IOException
 * @promise-error ArgumentException
 */
File.futimes = (fd, atime, mtime) => {
    return new BPromise((resolve, reject) => {
        if(!Number.isInteger(fd) || !Number.isInteger(atime) || !Number.isInteger(mtime))
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof fd} passed as arg for fd, Number expected`));
        }
        else{
            fs.futimes(fd, atime, mtime, (err) => {
                if(err)
                {
                    reject(new ExceptionManager.IOException(`IOException: I/O exception occured while dealing with '${fd}' file`, err));
                }
                else{
                    resolve(fd);
                }
            })
        }
    });
};

/**
 *
 * @param {Number} fd
 * @param {Number} mode
 * @returns {"bluebird"|any}
 * @promise-error IOException
 * @promise-error ArgumentException
 */
File.lchmod = (fd, mode) => {
    return new BPromise((resolve, reject) => {
        if(!Number.isInteger(fd) || !Number.isInteger(mode))
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof fd} passed as arg for fd, Number expected`));
        }
        else{
            fs.lchmod(fd, mode, (err) => {
                if(err)
                {
                    reject(new ExceptionManager.IOException(`IOException: I/O exception occured while dealing with '${fd}' file`, err));
                }
                else{
                    resolve(fd);
                }
            })
        }
    });
};

/**
 *
 * @param {Number} fd
 * @param {Number} uid
 * @param {Number} gid
 * @returns {"bluebird"|any}
 * @promise-error IOException
 * @promise-error ArgumentException
 */
File.lchown = (fd, uid, gid) => {
    return new BPromise((resolve, reject) => {
        if(!Number.isInteger(fd) || !Number.isInteger(uid) || !Number.isInteger(gid))
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof fd} passed as arg for fd, Number expected`));
        }
        else{
            fs.lchmod(fd, uid, gid, (err) => {
                if(err)
                {
                    reject(new ExceptionManager.IOException(`IOException: I/O exception occured while dealing with '${fd}' file`, err));
                }
                else{
                    resolve(fd);
                }
            })
        }
    });
};

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
File.link = (existingPath, newPath) => {
    return new BPromise((resolve, reject) => {
        if(existingPath === null || newPath === null)
        {
            reject(ExceptionManager.ArgumentNullException(`ArgumentNullException: data or mode are null`));
        }
        else if((typeof existingPath !== 'string' &&  Buffer.isBuffer(existingPath) === false)
            || (
                typeof newPath !== 'string' &&  Buffer.isBuffer(newPath) === false))
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof existingPath} passed as firs arg, Number|String|Buffer expected`));
        }


        else{

            try {
                UtilityManager.isValidPath(String(existingPath));
                UtilityManager.isValidPath(String(newPath));
            } catch (e) {
                throw e;
            }

            fs.link(existingPath, newPath, (err) => {
                if(err)
                {
                    reject(new ExceptionManager.IOException(`IOException: I/O exception occured while dealing with '${existingPath}' file`, err));
                }
                else{
                    resolve(pathUtil);
                }
            })
        }
    });
};


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
File.lstat = (path) => {
    return new BPromise((resolve, reject) => {
        if(typeof path !== 'string' &&  Buffer.isBuffer(path) === false)
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof path} passed as firs arg, Number|String|Buffer expected`));
        }
        else{
            try{
                UtilityManager.isValidPath(String(path))
            }
            catch(e){
                reject(e);
                return;
            }

                fs.access(path, fs.constants.F_OK, (err) => {
                    if(err)
                    {
                        if (err.code === "ENOENT")
                        {
                            reject(new ExceptionManager.FileNotFoundException(`FileNotFoundException: file '${pathUtil.resolve(path)}' not Found or don't exist`));
                        }
                        else{
                            reject(new ExceptionManager.IOException(`IOException: I/O exception occured while dealing with '${path}' file`, err));
                        }
                    }
                    else{
                        fs.lstat(path, (err) => {
                            if(err)
                            {
                                reject(new ExceptionManager.IOException(`IOException: I/O exception occured while dealing with '${path}' file`, err));
                            }
                            else{
                                resolve(path);
                            }
                        })
                    }
                })
        }
    });
};

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
File.mkdir = (path, mode) => {
    return new BPromise((resolve, reject) => {
        mode = mode || 0o777;
        if(typeof path !== 'string' &&  Buffer.isBuffer(path) === false)
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof path} passed as firs arg, Number|String|Buffer expected`));
        }
        else{
            try{
                UtilityManager.isValidPath(String(path))
            }
            catch(e){
                reject(e);
                return;
            }

            if(!Number.isInteger(mode))
            {
                reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof mode} passed as arg for mode, Number expected`));
            }
            else{
                fs.access(pathUtil.dirname(path), fs.constants.R_OK | fs.constants.W_OK, (err) => {
                    if(err)
                    {
                        if (err.code === "ENOENT")
                        {
                            reject(new ExceptionManager.DirectoryNotFoundException(`DirectoryNotFoundException: '${pathUtil.dirname(path)}' not Found or don't exist`));
                        }
                        else{
                            reject(new ExceptionManager.UnauthorizedAccessException(`UnauthorizedAccessException: have no access on '${pathUtil.dirname(path)}`, err))
                        }
                    }
                    else{
                        fs.mkdir(path, mode, (err) => {
                            if(err)
                            {
                                reject(new ExceptionManager.IOException(`IOException: I/O exception occured while dealing with '${path}' file`, err));
                            }
                            else{
                                resolve(path);
                            }
                        });
                    }
                })

            }
        }
    });
};


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
File.mkdtemp = (prefix, options) => {
    return new BPromise((resolve, reject) => {
        if(typeof prefix !== 'string')
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof prefix} passed as firs arg, Number|String|Buffer expected`));
        }
        else{
            try{
                UtilityManager.isValidPath(String(prefix))
            }
            catch(e){
                reject(e);
                return;
            }

                fs.mkdtemp(prefix, options, (err, folder) => {
                    if(err)
                    {
                        reject(new ExceptionManager.IOException(`IOException: I/O exception occured while opening '${prefix}' file`, err))

                    }
                    else{
                        resolve(folder);
                    }
                })


        }
    });

};

/**
 *
 * @param {String|Buffer} path
 * @param {String|Number} flags
 * @param {Number?} mode
 * @returns {"bluebird"|any}
 * @promise-error DirectoryNotFoundException
 * @promise-error ArgumentException
 * @promise-error ArgumentNullException
 * @promise-error DirectoryNotFoundException
 * @promise-error FileNotFoundException
 * @promise-error {PathTooLongException}
 * @promise-error {NotSupportedException}
 */
File.open = (path, flags, mode) => {
    return new BPromise((resolve, reject) => {
        mode = mode || 0o666;
        if(typeof path !== 'string' &&  Buffer.isBuffer(path) === false)
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof path} passed as firs arg, Number|String|Buffer expected`));
        }
        else{
            try{
                UtilityManager.isValidPath(String(path))
            }
            catch(e){
                reject(e);
                return;
            }

            let allowedFlags = [
                'r',
                'r+',
                'rs+',
                'w',
                'wx',
                'w+',
                'wx+',
                'a',
                'ax',
                'a+',
                'ax+'

            ];

            if(!Number.isInteger(mode))
            {
                reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof mode} passed as arg for mode, Number expected`));
            }
            else if(typeof flags === 'string' && !UtilityManager.inArray(flags, allowedFlags))
            {
                reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: illegal flags passed as arg for flags`));

            }
            else{
                fs.access(pathUtil.dirname(path), fs.constants.R_OK | fs.constants.W_OK, (err) => {
                    if(err)
                    {
                        if (err.code === "ENOENT")
                        {
                            reject(new ExceptionManager.DirectoryNotFoundException(`DirectoryNotFoundException: '${pathUtil.dirname(path)}' not Found or don't exist`));
                        }
                        else{
                            reject(new ExceptionManager.UnauthorizedAccessException(`UnauthorizedAccessException: have no access on '${pathUtil.dirname(path)}`, err))
                        }
                    }
                    else{
                        fs.open(path, flags,mode, (err, fd) => {
                            if(err)
                            {
                                if (err.code === "ENOENT")
                                {
                                    reject(new ExceptionManager.FileNotFoundException(`FileNotFoundException: file '${pathUtil.resolve(path)}' not Found or don't exist`));
                                }
                                else{
                                    reject(new ExceptionManager.IOException(`IOException: I/O exception occured while dealing with '${path}' file`, err));
                                }
                            }
                            else{
                                resolve(fd);
                            }
                        });
                    }
                })

            }
        }
    });
};

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
File.read = (fd, buffer, offset, length, position) => {
  return new BPromise((resolve, reject) => {
      if(!Buffer.isBuffer(buffer) || !Number.isInteger(fd) || !Number.isInteger(offset) || !Number.isInteger(length))
      {
          reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: expected Number|String|Buffer expected`));
      }
      else{
          fs.read(fd, buffer, offset, length, position, (err, bytesRead, buffer) => {
              if(err)
              {
                  reject(new ExceptionManager.IOException(`IOException: I/O exception occured while reading '${fd}' file`, err))
              }
              else{
                  resolve([bytesRead, buffer]);
              }
          });
      }
  });
};


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
File.readdir = (path, options) => {
    return new BPromise((resolve, reject) => {
        if(typeof path !== 'string' &&  Buffer.isBuffer(path) === false)
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof path} passed as firs arg, Number|String|Buffer expected`));
        }
        else{
            try{
                UtilityManager.isValidPath(String(path))
            }
            catch(e){
                reject(e);
                return;
            }


                fs.access(path, fs.constants.F_OK, (err) => {
                    if(err)
                    {
                        if (err.code === "ENOENT")
                        {
                            reject(new ExceptionManager.DirectoryNotFoundException(`DirectoryNotFoundException: '${pathUtil.dirname(path)}' not Found or don't exist`));
                        }
                        else{
                            reject(new ExceptionManager.UnauthorizedAccessException(`UnauthorizedAccessException: have no access on '${pathUtil.dirname(path)}`, err))
                        }
                    }
                    else{
                        fs.stat(path, (err, stats) => {
                            if(err)
                            {
                                reject(new ExceptionManager.IOException(`IOException: I/O exception occured while opening '${path}' file`, err))
                            }
                            else  if(stats.isFile())
                            {
                                reject(new ExceptionManager.FileWhileExpectedDirectoryException(`FileWhileExpectedDirectoryException: '${path}' is a file`))
                            }
                            else {
                                fs.access(path, fs.constants.R_OK, (err) => {
                                    if(err)
                                    {
                                        reject(new ExceptionManager.UnauthorizedAccessException(`UnauthorizedAccessException: have no access on '${pathUtil.resolve(path)}`, err))
                                    }
                                    else{
                                        fs.readdir(path, options, (err, files) => {
                                            if(err)
                                            {
                                                reject(new ExceptionManager.IOException(`IOException: I/O exception occured while dealing with '${path}' file`, err));
                                            }
                                            else{
                                                resolve(files);
                                            }
                                        });
                                    }
                                });
                            }
                        });


                    }
                })


        }
    });
};

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
File.readFile = (file, options) => {
    return new BPromise((resolve, reject) => {
        if(file === null)
        {
            reject(ExceptionManager.ArgumentNullException(`ArgumentNullException: data or file args is null`));
        }
        else if(!Number.isInteger(file) && typeof file !== 'string' &&  Buffer.isBuffer(file) === false)
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof mode} passed as firs arg, Number|String|Buffer expected`));
        }


        if(typeof file === 'string' ||  Buffer.isBuffer(file) === false)
        {
            UtilityManager.isValidPath(String(file));
        }


        fs.access(file, fs.constants.R_OK, (err) => {
            if(err)
            {
                if(err.code === "ENOENT")
                {
                    reject(new ExceptionManager.FileNotFoundException(`FileNotFoundException: file '${pathUtil.resolve(file)}' not Found or don't exist`));

                }
                else{
                    reject(new ExceptionManager.UnauthorizedAccessException(`UnauthorizedAccessException: have no access `))
                }
            }
            else{
                fs.stat(file, (err, stats) => {
                    if(err)
                    {
                        reject(new ExceptionManager.IOException(`IOException: I/O exception occured while opening '${file}' file`, err))
                    }
                    else  if(stats.isDirectory())
                    {
                        reject(new ExceptionManager.DirectoryWhileExpectedFileException(`DirectoryWhileExpectedFileException: '${file}' is a Directory`))
                    }
                    else {
                        fs.readFile(file, options, (err, data) => {
                            if (err){
                                reject(new ExceptionManager.IOException(`IOException: I/O exception occured while writing '${file}' file`, err))
                            }
                            resolve(Buffer.from(data));
                        });
                    }
                });

            }
        });

    });
};

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
File.readlink = (path, options) => {
    return new BPromise((resolve, reject) => {
        if(typeof path !== 'string' &&  Buffer.isBuffer(path) === false)
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof path} passed as firs arg, Number|String|Buffer expected`));
        }
        else{
            try{
                UtilityManager.isValidPath(String(path))
            }
            catch(e){
                reject(e);
                return;
            }


            fs.access(path, fs.constants.F_OK, (err) => {
                if(err)
                {
                    if (err.code === "ENOENT")
                    {
                        reject(new ExceptionManager.DirectoryOrFileNotFoundException(`DirectoryOrFileNotFoundException: '${path}' not Found or don't exist`));
                    }
                    else{
                        reject(new ExceptionManager.UnauthorizedAccessException(`UnauthorizedAccessException: have no access on '${pathUtil.dirname(path)}`, err))
                    }
                }
                else{
                    fs.access(path, fs.constants.R_OK, (err) => {
                        if(err)
                        {
                            reject(new ExceptionManager.UnauthorizedAccessException(`UnauthorizedAccessException: have no access on '${pathUtil.resolve(path)}`, err))
                        }
                        else{
                            fs.readlink(path, options, (err, data) => {
                                if(err)
                                {
                                    reject(new ExceptionManager.IOException(`IOException: I/O exception occured while dealing with '${path}' file`, err));
                                }
                                else{
                                    resolve(data);
                                }
                            });
                        }
                    });

                }
            })


        }
    });
};

/**
 *
 * @param {String|Buffer} path
 * @returns {"bluebird"|any}
 * @promise-error {PathTooLongException}
 * @promise-error {NotSupportedException}
 */
File.realpath = (path) => {
    return new BPromise((resolve, reject) => {
        if(typeof path !== 'string' &&  Buffer.isBuffer(path) === false)
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof path} passed as firs arg, Number|String|Buffer expected`));
        }
        else {
            try {
                UtilityManager.isValidPath(String(path))
            }
            catch(e){
                throw e;
            }
            resolve(pathUtil.resolve(path));
        }

    });
};

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
File.rename = (existingPath, newPath) => {
    return new BPromise((resolve, reject) => {
        if(existingPath === null || newPath === null)
        {
            reject(ExceptionManager.ArgumentNullException(`ArgumentNullException: data or mode are null`));
        }
        else if((typeof existingPath !== 'string' &&  Buffer.isBuffer(existingPath) === false)
            || (
            typeof newPath !== 'string' &&  Buffer.isBuffer(newPath) === false))
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof existingPath} passed as firs arg, Number|String|Buffer expected`));
        }


        else{

            try {
                UtilityManager.isValidPath(String(existingPath));
                UtilityManager.isValidPath(String(newPath));
            } catch (e) {
                throw e;
            }

            fs.access(existingPath, fs.constants.R_OK | fs.constants.W_OK, (err) => {
                if(err)
                {
                    if (err.code === "ENOENT")
                    {
                        reject(new ExceptionManager.FileNotFoundException(`FileNotFoundException: file '${pathUtil.resolve(existingPath)}' not Found or don't exist`));
                    }
                    else{
                        reject(new ExceptionManager.UnauthorizedAccessException(`UnauthorizedAccessException: have no access `))
                    }
                }
                else{
                    fs.rename(existingPath, newPath,(err) => {
                            if (err){
                                reject(new ExceptionManager.IOException(`IOException: I/O exception occured while writing '${existingPath}' file`, err))
                            }
                            resolve(newPath);
                    });
                }
            });

        }
    });
};


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
File.stat = (path) => {
    return new BPromise((resolve, reject) => {
        if(path === null )
        {
            reject(new ExceptionManager.ArgumentNullException(`ArgumentNullException: path or uid, gid args are null`));
        }
        else if(typeof path !== 'string' &&  Buffer.isBuffer(path) === false)
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof path} passed as firs arg, Number|String|Buffer expected`));
        }
        try {
            UtilityManager.isValidPath(String(path));
        } catch (e) {
            throw e;
        }

        fs.access(path, fs.constants.F_OK, (err) => {
            if(err)
            {
                if(err.code === "ENOENT")
                {
                    reject(new ExceptionManager.FileNotFoundException(`FileNotFoundException: file '${pathUtil.resolve(path)}' not Found or don't exist`));
                }
                else{
                    reject(new ExceptionManager.IOException(`IOException: I/O exception occured while writing '${path}' file`, err))
                }
            }
            else{
                fs.stat(path, (err, stats) => {
                    if(err)
                    {
                        reject(new ExceptionManager.IOException(`IOException: I/O exception occured while writing '${path}' file`, err))
                    }
                    else{
                        resolve(stats);
                    }
                });
            }
        });

    });
};


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
File.writeV002 = (fd, buffer, offset, length, position) => {
    return new BPromise((resolve, reject) => {
        if(!Buffer.isBuffer(buffer) || !Number.isInteger(fd) || !Number.isInteger(offset) || !Number.isInteger(length))
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: expected Number|String|Buffer expected`));
        }
        else{
            fs.write(fd, buffer, offset, length, position, (err, written, buffer_) => {
                if(err)
                {
                    reject(new ExceptionManager.IOException(`IOException: I/O exception occured while reading '${fd}' file`, err))
                }
                else{
                    resolve([written, buffer_]);
                }
            });
        }
    });

};

File.write =  (fd, buffer, offset, length, position) => {
  return File.writeV002(fd, buffer, offset, length, position);
};

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
File.writeV0115 = (fd, string, position, encoding) => {
    return new BPromise((resolve, reject) => {
        if(typeof string !== 'string' || !Number.isInteger(fd) )
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: expected Number|String expected`));
        }
        else{
            fs.write(fd, string, position, encoding, (err, written, string_) => {
                if(err)
                {
                    reject(new ExceptionManager.IOException(`IOException: I/O exception occured while reading '${fd}' file`, err))
                }
                else{
                    resolve([written, string_]);
                }
            });
        }
    });

};

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
File.writeFile = (file, data, options) => {
    return new BPromise((resolve, reject) => {
        if(data === null || file === null)
        {
            reject(ExceptionManager.ArgumentNullException(`ArgumentNullException: data or file args is null`));
        }
        else if(!Number.isInteger(file) && typeof file !== 'string' &&  Buffer.isBuffer(file) === false)
        {
            reject(new ExceptionManager.ArgumentException(`ExceptionManager.ArgumentException: ${typeof mode} passed as firs arg, Number|String|Buffer expected`));
        }


        if(typeof file === 'string' ||  Buffer.isBuffer(file) === false)
        {
            UtilityManager.isValidPath(String(file));
        }


        fs.access(file, fs.constants.W_OK, (err) => {
            if(err)
            {
                if(err.code === "ENOENT")
                {
                    fs.writeFile(file, '',(err) => {
                        if(err)
                        {
                            reject(new ExceptionManager.IOException(`IOException: I/O exception occured while opening '${file}' file`, err))
                        }
                        else{
                            fs.access(file, fs.constants.R_OK | fs.constants.W_OK, (err) => {
                                if(err)
                                {
                                    reject(new ExceptionManager.UnauthorizedAccessException(`UnauthorizedAccessException: have no access `))
                                }
                                else{
                                    fs.stat(file, (err, stats) => {
                                        if(err)
                                        {
                                            reject(new ExceptionManager.IOException(`IOException: I/O exception occured while opening '${file}' file`, err))
                                        }
                                        else  if(stats.isDirectory())
                                        {
                                            reject(new ExceptionManager.DirectoryWhileExpectedFileException(`DirectoryWhileExpectedFileException: '${file}' is a Directory`))
                                        }
                                        else {
                                            fs.writeFile(file, data,options, (err) => {
                                                if (err){
                                                    reject(new ExceptionManager.IOException(`IOException: I/O exception occured while writing '${file}' file`, err))
                                                }
                                                resolve(Buffer.from(String(data)));
                                            });
                                        }
                                    });
                                }
                            });

                        }
                    });
                }
                else{
                    reject(new ExceptionManager.UnauthorizedAccessException(`UnauthorizedAccessException: have no access `))
                }
            }
            else{
                fs.appendFile(file, data,options, (err) => {
                    if (err){
                        reject(new ExceptionManager.IOException(`IOException: I/O exception occured while writing '${file}' file`, err))
                    }
                    resolve(Buffer.from(String(data)));
                });
            }
        });

    });

};
