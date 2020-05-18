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
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const fetch = require("node-fetch");
const vscode = require("vscode");
const xml2js = require("xml2js");
const utilities_1 = require("./utilities");
let nonUserCall = false;
function getGradleRioVMXRegex() {
    return /(id\s*?[\"|\']com\.kauailabs\.first\.GradleRIO[\"|\'].*?version\s*?[\"|\'])(.+?)([\"|\'])/g;
}
function getGradleRioRegex() {
    return /(id\s*?[\"|\']edu\.wpi\.first\.GradleRIO[\"|\'].*?version\s*?[\"|\'])(.+?)([\"|\'])/g;
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    let disposable = vscode.commands.registerCommand('vmxpi.updateWPILib', () => __awaiter(this, void 0, void 0, function* () {
        // The code you place here will be executed every time your command is executed
        run(false);
    }));
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function run(nonUserCalled) {
    return __awaiter(this, void 0, void 0, function* () {
        nonUserCall = nonUserCalled;
        const latestVersion = yield getLatestGradleRIOVersion();
        if (latestVersion !== undefined) {
            setGradleRIOVersion(latestVersion);
        }
        else {
            vscode.window.showErrorMessage('Error in finding the latest version of WPILib, are you online?');
        }
    });
}
exports.run = run;
function getLatestGradleRIOVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        const metaDataUrl = 'https://plugins.gradle.org/m2/com.kauailabs.first.GradleRIO/com.kauailabs.first.GradleRIO.gradle.plugin/maven-metadata.xml';
        try {
            const response = yield fetch.default(metaDataUrl, {
                timeout: 5000,
            });
            if (response === undefined) {
                console.log('failed to fetch URL: ' + metaDataUrl);
                return undefined;
            }
            if (response.status >= 200 && response.status <= 300) {
                const text = yield response.text();
                const version = yield new Promise((resolve, reject) => {
                    xml2js.parseString(text, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            // tslint:disable-next-line:no-unsafe-any
                            resolve(result.metadata.versioning[0].latest[0]);
                        }
                    });
                });
                return version;
            }
            else {
                console.log('bad status: ' + response.status.toString());
                return undefined;
            }
        }
        catch (err) {
            console.log('remote gradlerio exception', err);
            return undefined;
        }
    });
}
function setGradleRIOVersion(version) {
    return __awaiter(this, void 0, void 0, function* () {
        var resolvedVersion = yield version;
        try {
            const buildGradlePath = (vscode.workspace.rootPath + '\\build.gradle');
            const buildGradleFile = yield utilities_1.readFileAsync(buildGradlePath, 'utf8');
            //Checks to see if the latest version is already used
            const newgFile = buildGradleFile.replace(getGradleRioVMXRegex(), `$1${resolvedVersion}$3`);
            if (!buildGradleFile.includes(newgFile)) {
                yield utilities_1.writeFileAsync(buildGradlePath, newgFile);
                if (!nonUserCall) {
                    vscode.window.showInformationMessage('WPILib has been updated to ' + resolvedVersion);
                    vscode.commands.executeCommand('wpilibcore.buildCode');
                }
            }
            else if (!nonUserCall) {
                vscode.window.showInformationMessage('WPILib is already at it\'s latest version');
            }
        }
        catch (err) {
            console.log('error setting wpilib (gradlerio) version');
            return;
        }
    });
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=updateWPILib.js.map