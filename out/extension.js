"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updateWPILib = require("./updateWPILib");
const setVMXPiTarget = require("./setVMXPiTarget");
const setRoboRIOTarget = require("./setRoboRIOTarget");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    updateWPILib.activate(context);
    setVMXPiTarget.activate(context);
    setRoboRIOTarget.activate(context);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map