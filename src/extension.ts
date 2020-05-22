// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as updateWPILib from './updateWPILib';
import * as setVMXPiTarget from './setVMXPiTarget';
import * as setRoboRIOTarget from './setRoboRIOTarget';
import * as checkGradleStatus from './checkGradleStatus';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {


    updateWPILib.activate(context);
    setVMXPiTarget.activate(context);
    setRoboRIOTarget.activate(context);
    checkGradleStatus.activate(context);
    

    context.subscriptions.push(vscode.commands.registerCommand('vmxpi.openCommandPalette', async () => {
        await vscode.commands.executeCommand('workbench.action.quickOpen', '>VMX-Pi: ');
    }));
}



// this method is called when your extension is deactivated
export function deactivate() {}

