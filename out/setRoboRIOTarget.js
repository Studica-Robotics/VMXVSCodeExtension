"use strict";
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
const vscode = require("vscode");
const utilities_1 = require("./utilities");
const updateWPILib = require("./roborioWPILibUpdate");
function getPluginRegex() {
    return /(id\s*?[\"|\'])(.+?)(\.first\.GradleRIO[\"|\'].*?version\s*?[\"|\'])(.+?)([\"|\'])/g;
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('vmxpi.setRoboRIOTarget', () => __awaiter(this, void 0, void 0, function* () {
        // The code you place here will be executed every time your command is executed
        try {
            const buildGradlePath = (vscode.workspace.rootPath + '\\build.gradle');
            const buildGradleFile = yield utilities_1.readFileAsync(buildGradlePath, 'utf8');
            //Replace the GradleRIO plugin line
            var newgFile = buildGradleFile.replace(getPluginRegex(), `$1${'edu.wpi'}$3${'run.wpilib.update'}$5`);
            newgFile = newgFile.replace('vmxpi', 'roboRIO');
            newgFile = newgFile.replace(/wpi.platforms.raspbian/g, 'wpi.platforms.roborio');
            yield utilities_1.writeFileAsync(buildGradlePath, newgFile);
            updateWPILib.run();
            vscode.commands.executeCommand('wpilibcore.buildCode');
            vscode.window.showInformationMessage('Your project is now configured for a RoboRIO target');
        }
        catch (err) {
            console.log('error setting wpilib (gradlerio) version');
            return;
        }
    }));
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=setRoboRIOTarget.js.map