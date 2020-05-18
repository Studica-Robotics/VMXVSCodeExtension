// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fetch from 'node-fetch';
import * as vscode from 'vscode';
import * as xml2js from 'xml2js';
import { existsAsync, readdirAsync, readFileAsync, writeFileAsync } from './utilities';
import * as updateWPILib from './updateWPILib';



function getPluginRegex() {
	return /(id\s*?[\"|\'])(.+?)(\.first\.GradleRIO[\"|\'].*?version\s*?[\"|\'])(.+?)([\"|\'])/g;
}


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vmxpi.setVMXPiTarget', async () => {
		// The code you place here will be executed every time your command is executed

        try { 
            const buildGradlePath = (vscode.workspace.rootPath + '\\build.gradle');
            const buildGradleFile = await readFileAsync(buildGradlePath, 'utf8');
    
            //Replace the GradleRIO plugin line
            var newgFile = buildGradleFile.replace(getPluginRegex(), `$1${'com.kauailabs'}$3${'run.wpilib.update'}$5`);
            
            newgFile = newgFile.replace('roboRIO', 'vmxpi');
            newgFile = newgFile.replace(/wpi.platforms.roborio/g, 'wpi.platforms.raspbian');
            
            await writeFileAsync(buildGradlePath, newgFile);

            updateWPILib.run(true);

            vscode.commands.executeCommand('wpilibcore.buildCode');

            vscode.window.showInformationMessage('Your project is now configured for a VMX-Pi target');

            
        }
         catch (err) {
            console.log('error setting wpilib (gradlerio) version');
        return;
      }


	});
	

	context.subscriptions.push(disposable);
}



// this method is called when your extension is deactivated
export function deactivate() {}

