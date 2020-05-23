// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as fetch from 'node-fetch';
import * as vscode from 'vscode';
import * as xml2js from 'xml2js';
import { existsAsync, readdirAsync, readFileAsync, writeFileAsync } from './utilities';

let nonUserCall = false;


function getGradleRioRegex() {
	return /(id\s*?[\"|\']edu\.wpi\.first\.GradleRIO[\"|\'].*?version\s*?[\"|\'])(.+?)([\"|\'])/g;
}


export async function run() {

	nonUserCall = true;

	const latestVersion = await getLatestGradleRIOVersion();

	if (latestVersion !== undefined) {
		setGradleRIOVersion(latestVersion);
	}
	else {
		vscode.window.showErrorMessage('Error in finding the latest version of WPILib, are you online?');
	}
}


async function getLatestGradleRIOVersion() {

    const metaDataUrl = 'https://plugins.gradle.org/m2/edu/wpi/first/GradleRIO/maven-metadata.xml';
    try {
      const response = await fetch.default(metaDataUrl, {
        timeout: 5000,
      });
      if (response === undefined) {
        console.log('failed to fetch URL: ' + metaDataUrl);
        return undefined;
      }
      if (response.status >= 200 && response.status <= 300) {
        const text = await response.text();
        const version = await new Promise<string>((resolve, reject) => {
          xml2js.parseString(text, (err, result) => {
            if (err) {
              reject(err);
            } else {
              // tslint:disable-next-line:no-unsafe-any
              resolve(result.metadata.versioning[0].latest[0]);
            }
          });
		});
        return version;
      } else {
        console.log('bad status: ' + response.status.toString());
        return undefined;
      }
    } catch (err) {
		console.log('remote gradlerio exception', err);
      	return undefined;
    }

}

async function setGradleRIOVersion(version: string): Promise<void> {

	var resolvedVersion = await version;

	try { 
		const buildGradlePath = (vscode.workspace.rootPath + '\\build.gradle');
	
		const buildGradleFile = await readFileAsync(buildGradlePath, 'utf8');

		//Checks to see if the latest version is already used
		const newgFile = buildGradleFile.replace(getGradleRioRegex(), `$1${resolvedVersion}$3`);
		if (!buildGradleFile.includes(newgFile)) {
			await writeFileAsync(buildGradlePath, newgFile);
			if (!nonUserCall){
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
		vscode.window.showErrorMessage('No build.gradle file found, is this a WPILib project?');
	return;
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}

