/**
 * Created by dev8 on 25/11/2016.
 */

let util = require('util');
let ExceptionManager = module.exports;

/**
 * illegal arg type
 * @type {Error}
 */
ExceptionManager.ArgumentException =  function(msg, father){
    this.msg = msg || "Error";
    this.father = father || null;
    this.name = 'Exception';
};

/**
 * null args while expected not null
 * @type {Error}
 */
ExceptionManager.ArgumentNullException =  function(msg, father){
    this.msg = msg || "Error";
    this.father = father || null;
    this.name = 'Exception';
};

/**
 * path is invalid (for example, the directory doesn’t exist or it is on an unmapped drive).
 * @type {Error}
 */
ExceptionManager.DirectoryNotFoundException =  function(msg, father){
    this.msg = msg || "Error";
    this.father = father || null;
    this.name = 'Exception';
};

/**
 * The file specified by path was not found.
 * @type {Error}
 */
ExceptionManager.FileNotFoundException =  function(msg, father){
    this.msg = msg || "Error";
    this.father = father || null;
    this.name = 'Exception';
};

/**
 * The file or dir specified by path was not found.
 * @type {Error}
 */
ExceptionManager.DirectoryOrFileNotFoundException =  function(msg, father){
    this.msg = msg || "Error";
    this.father = father || null;
    this.name = 'Exception';
};


/**
 * An I/O error occurred while opening the file.
 * @type {Error}
 */
ExceptionManager.IOException = function(msg, father){
    this.msg = msg || "Error";
    this.father = father || null;
    this.name = 'Exception';
};

/**
 * path exceeds the system-defined maximum length. For example, on Windows-based platforms,
 * paths must be less than 248 characters and file names must be less than 260 characters.
 * @type {Error}
 */
ExceptionManager.PathTooLongException =  function(msg, father){
    this.msg = msg || "Error";
    this.father = father || null;
    this.name = 'Exception';
};

/**
 * path is in an invalid format.
 * @type {Error}
 */
ExceptionManager.NotSupportedException =  function(msg, father){
    this.msg = msg || "Error";
    this.father = father || null;
    this.name = 'Exception';
};

/**
 * DirectoryWhileExpectedFileException
 * @type {Error}
 */
ExceptionManager.DirectoryWhileExpectedFileException =  function(msg, father){
    this.msg = msg || "Error";
    this.father = father || null;
    this.name = 'Exception';
};

/**
 * FileWhileExpectedDirectoryException
 * @type {Error}
 */
ExceptionManager.FileWhileExpectedDirectoryException =  function(msg, father){
    this.msg = msg || "Error";
    this.father = father || null;
    this.name = 'Exception';
};

/**
 * occured when path specifies a file that is read-only or have not rigth on file or dir.
 * or operation is not supported on the current platform.
 * @type {Error}
 */
ExceptionManager.UnauthorizedAccessException =  function(msg, father){
    this.msg = msg || "Error";
    this.father = father || null;
    this.name = 'Exception';
};

util.inherits(ExceptionManager.ArgumentException, Error);
util.inherits(ExceptionManager.ArgumentNullException, Error);
util.inherits(ExceptionManager.DirectoryNotFoundException, Error);
util.inherits(ExceptionManager.FileNotFoundException, Error);
util.inherits(ExceptionManager.IOException, Error);
util.inherits(ExceptionManager.PathTooLongException, Error);
util.inherits(ExceptionManager.NotSupportedException, Error);
util.inherits(ExceptionManager.DirectoryWhileExpectedFileException, Error);
util.inherits(ExceptionManager.UnauthorizedAccessException, Error);
util.inherits(ExceptionManager.FileWhileExpectedDirectoryException, Error);
util.inherits(ExceptionManager.DirectoryOrFileNotFoundException, Error);


