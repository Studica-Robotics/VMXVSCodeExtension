'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setExtensionContext = exports.extensionContext = exports.setJavaHome = exports.javaHome = exports.readdirAsync = exports.deleteFileAsync = exports.existsAsync = exports.mkdirAsync = exports.copyFileAsync = exports.writeFileAsync = exports.readFileAsync = exports.getPackageName = exports.getClassName = exports.getIsMac = exports.getIsWindows = void 0;
const fs = require("fs");
const util = require("util");
const vscode = require("vscode");
// General utilites usable by multiple classes
function getIsWindows() {
    const nodePlatform = process.platform;
    return nodePlatform === 'win32';
}
exports.getIsWindows = getIsWindows;
function getIsMac() {
    const nodePlatform = process.platform;
    return nodePlatform === 'darwin';
}
exports.getIsMac = getIsMac;
function getClassName() {
    return __awaiter(this, void 0, void 0, function* () {
        const promptString = 'Please enter a class name';
        const className = yield vscode.window.showInputBox({
            prompt: promptString,
            validateInput: (s) => {
                const match = s.match('^([a-zA-Z_]{1}[a-zA-Z0-9_]*)$');
                if (match === null || match.length === 0) {
                    return 'Invalid Classname';
                }
                return undefined;
            },
        });
        return className;
    });
}
exports.getClassName = getClassName;
function getPackageName() {
    return __awaiter(this, void 0, void 0, function* () {
        const promptString = 'Please enter a package name';
        const packageName = yield vscode.window.showInputBox({
            prompt: promptString,
            validateInput: (s) => {
                const match = s.match('^([a-zA-Z_]{1}[a-zA-Z0-9_]*(\\.[a-zA-Z_]{1}[a-zA-Z0-9_]*)*)$');
                if (match === null || match.length === 0) {
                    return 'Invalid Package Name';
                }
                return undefined;
            },
        });
        return packageName;
    });
}
exports.getPackageName = getPackageName;
exports.readFileAsync = util.promisify(fs.readFile);
exports.writeFileAsync = util.promisify(fs.writeFile);
exports.copyFileAsync = util.promisify(fs.copyFile);
exports.mkdirAsync = util.promisify(fs.mkdir);
exports.existsAsync = util.promisify(fs.exists);
exports.deleteFileAsync = util.promisify(fs.unlink);
exports.readdirAsync = util.promisify(fs.readdir);
function setJavaHome(jhome) {
    exports.javaHome = jhome;
}
exports.setJavaHome = setJavaHome;
function setExtensionContext(context) {
    exports.extensionContext = context;
}
exports.setExtensionContext = setExtensionContext;
//# sourceMappingURL=utilities.js.map