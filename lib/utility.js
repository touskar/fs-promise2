/**
 * Created by dev8 on 26/11/2016.
 */
let UtilityManager = module.exports;
let pathUtil = require('path');
let os = require('os');
let BPromise = require("bluebird");
let fs = require('fs');
let ExceptionManager = require("./exception.js");

UtilityManager.iterify = (data) => {
    if(data instanceof Array)
    {
        return data.map((current) => {
            return UtilityManager.iterify(current);
        });
    }
    else if(data instanceof Buffer)
    {
        return new Array(data.toString("UTF-8"));
    }
    return new Array(String(data));
};

UtilityManager.isInvalidPath = (path) => {
    path = String(path);
    path = pathUtil.isAbsolute(path) ? path : pathUtil.resolve(path);
    let platform = os.platform();
    if(~platform.toLowerCase().indexOf('darwin') || ~platform.toLowerCase().indexOf('linux'))
    {
        return !/^(\/[^\/ ]*)+\/?$/.test(path);
    }
    else if(~platform.toLowerCase().indexOf('win32'))
    {
        let regex = /^(?:(?:[a-z]:|\\\\[a-z0-9_.$●-]+\\[a-z0-9_.$●-]+)\\|\\?[^\\/:*?"<>|↵\r\n]+\\?)(?:[^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]*$/i;
        return !regex.test(path);
    }
    else{
        return false;
    }
};

UtilityManager.inArray = (needle, haystack, argStrict) => {
    let key = '',
        strict = !!argStrict;
    if(strict) {
        for(key in haystack) {
            if(Object.prototype.hasOwnProperty.call(haystack, key))
            {
                if(haystack[key] === needle) {
                    return true;
                }
            }
        }
    } else {
        for(key in haystack) {
            if(Object.prototype.hasOwnProperty.call(haystack, key))
            {
                if(haystack[key] == needle) {
                    return true;
                }
            }
        }
    }
    return false
};

UtilityManager.containInvalidCharPath = (path) => {
    path = String(path);
    path = pathUtil.isAbsolute(path) ? pathUtil.basename(path) : path;
    let platform = os.platform();
    if(~platform.toLowerCase().indexOf('darwin') || ~platform.toLowerCase().indexOf('linux'))
    {
        for(let i in path)
        {
            if(Object.prototype.hasOwnProperty.call(path, i))
            {
                if(path.charCodeAt(i) === 0)
                {
                    return true;
                }
            }
        }
        return !!~path.indexOf('/');
    }
    else if(~platform.toLowerCase().indexOf('win32'))
    {
        if(~path.indexOf('>') || ~path.indexOf('<') || ~path.indexOf(':') || ~path.indexOf('"') || ~path.indexOf('/') ||
            ~path.indexOf('\\') || ~path.indexOf('|') || ~path.indexOf('?') || ~path.indexOf('*'))
        {
            return true;
        }

        for(let i in path)
        {
            if(Object.prototype.hasOwnProperty.call(path, i))
            {
                if(path.charCodeAt(i) <= 31)
                {
                    return true;
                }
            }
        }

        return false;
    }
    else{
        return false;
    }
};

UtilityManager.pathTooLong = (path) => {
    let isAbsolute = pathUtil.isAbsolute(path) ;
    let platform = os.platform();
    if(~platform.toLowerCase().indexOf('darwin') || ~platform.toLowerCase().indexOf('linux'))
    {
        return false;
    }
    else if(~platform.toLowerCase().indexOf('win32'))
    {
        if(isAbsolute)
        {
            return path.length > 248;
        }
        else{
            return path.length > 260;
        }
    }
    else{
        return true;
    }
};

UtilityManager.normalizeEncoding = (encoding) => {
    return String(encoding).toUpperCase();
};

UtilityManager.isValidPath = (path) => {
        if(path === null)
        {
            throw new ExceptionManager.ArgumentNullException(`ArgumentNullException: path or data null`);
        }
        else if(path === '' || String(path).trim().length === 0 || UtilityManager.containInvalidCharPath(path))
        {
            throw new ExceptionManager.ArgumentException(`ArgumentException: Invalid file name,'${path}' contain illegal Character`);
        }
        else if(UtilityManager.pathTooLong(path))
        {
            throw new ExceptionManager.PathTooLongException(`PathTooLongException: file name ${path} or access path ${pathUtil.resolve(path)} too long`);
        }
        else if(UtilityManager.isInvalidPath(path))
        {
            throw new ExceptionManager.NotSupportedException(`NotSupportedException: Invalid path name ${path}`);
        }
};

