import * as vscode from 'vscode';
import { existsAsync, readdirAsync, readFileAsync, writeFileAsync } from './utilities';


function getPluginRegex() {
    return /(id\s*?[\"|\'])(.+?)(\.first\.GradleRIO[\"|\'].*?version\s*?[\"|\'])(.+?)([\"|\'])/g;
}

function getGradleRioVMXRegex() {
    return /(id\s*?[\"|\']com\.kauailabs\.first\.GradleRIO[\"|\'].*?version\s*?[\"|\'])(.+?)([\"|\'])/g;
}

function getGradleRioRegex() {
    return /(id\s*?[\"|\']edu\.wpi\.first\.GradleRIO[\"|\'].*?version\s*?[\"|\'])(.+?)([\"|\'])/g;
}


//Each line check reports a 0, 1, or 2. 0 = Line not found. 1 = VMX Configuration set. 2 = RoboRIO Configuration.
export async function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('vmxpi.checkGradleStatus', async () => {


        try {
            const buildGradlePath = (vscode.workspace.rootPath + '\\build.gradle');
            const buildGradleFile = await readFileAsync(buildGradlePath, 'utf8');

            var pluginLine = checkPluginLine(buildGradleFile);
            var targetsLine = checkTargetsLine(buildGradleFile);

            if (buildGradleFile.includes('id \"cpp\"')) {
                var platformsLine = checkPlatformsLine(buildGradleFile, true);
                var artifactsLine = checkArtifactsLine(buildGradleFile);
                if ((pluginLine + targetsLine + platformsLine) === 3) {
                    if (artifactsLine === "cpp") {
                        vscode.window.showInformationMessage("Project configured for VMX-Pi C++ usage");
                    }
                }
                else if ((pluginLine + targetsLine + platformsLine) === 6) {
                    if (artifactsLine === "cpp") {
                        vscode.window.showInformationMessage("Project configured for RoboRIO C++ usage");
                    }
                }
                else {
                    vscode.window.showErrorMessage("Project is not properly configured for either RoboRIO or VMX-Pi usage");
                }

                if (artifactsLine !== "cpp") {
                    vscode.window.showErrorMessage("Project language is not properly configured");
                }
            }
            else if (buildGradleFile.includes('id \"java\"')) {
                var platformsLine = checkPlatformsLine(buildGradleFile, false);
                var artifactsLine = checkArtifactsLine(buildGradleFile);
                if ((pluginLine + targetsLine + platformsLine) === 3) {
                    if (artifactsLine === "java") {
                        vscode.window.showInformationMessage("Project configured for VMX-Pi Java usage");
                    }
                }
                else if ((pluginLine + targetsLine + platformsLine) === 6) {
                    if (artifactsLine === "java") {
                        vscode.window.showInformationMessage("Project configured for RoboRIO Java usage");
                    }
                }
                else {
                    vscode.window.showErrorMessage("Project is not properly configured for either RoboRIO or VMX-Pi usage");
                }

                if (artifactsLine !== "java") {
                    vscode.window.showErrorMessage("Project language is not properly configured");
                }
            }
            else {
                vscode.window.showErrorMessage("Project language is not properly configured")
            }
        }
        catch (err) {
            vscode.window.showErrorMessage('No build.gradle file found, is this a WPILib project?');
            return;
        }
    });


    context.subscriptions.push(disposable);
}

//0 = Line not found. 1 = VMX Configuration set. 2 = RoboRIO Configuration.
function checkPluginLine(buildGradle: String) {
    if (buildGradle.includes('id \"com.kauailabs.first.GradleRIO\" version ')) {
        return 1;
    }
    else if (buildGradle.includes('id \"edu.wpi.first.GradleRIO\" version ')) {
        return 2;
    }
    return 0;
}

//0 = Line not found. 1 = VMX Configuration set. 2 = RoboRIO Configuration.
function checkTargetsLine(buildGradle: String) {
    if (buildGradle.includes('vmxpi(\"roborio\")')) {
        return 1;
    }
    else if (buildGradle.includes('roboRIO(\"roborio\")')) {
        return 2;
    }
    return 0;
}

//Checks the artifacts to determine what language is being used. Currently used as a second language reference point
function checkArtifactsLine(buildGradle: String) {
    if (buildGradle.includes('frcNativeArtifact(\'frcCpp\')')) {
        return 'cpp';
    }
    else if (buildGradle.includes('frcJavaArtifact(\'frcJava\')')) {
        return 'java';
    }
    return null;
}

//0 = Line not found. 1 = VMX Configuration set. 2 = RoboRIO Configuration.
function checkPlatformsLine(buildGradle: String, cpp: boolean) {
    if (cpp) {
        if (buildGradle.includes('targetPlatform wpi.platforms.raspbian')) {
            return 1;
        }
        else if (buildGradle.includes('targetPlatform wpi.platforms.roborio')) {
            return 2;
        }
    }
    else {
        if (buildGradle.includes('nativeZip wpi.deps.wpilibJni(wpi.platforms.raspbian)') && buildGradle.includes('nativeZip wpi.deps.vendor.jni(wpi.platforms.raspbian)')) {
            return 1;
        }
        else if (buildGradle.includes('nativeZip wpi.deps.wpilibJni(wpi.platforms.roborio)') && buildGradle.includes('nativeZip wpi.deps.vendor.jni(wpi.platforms.roborio)')) {
            return 2;
        }
    }
    return 0;
}


// this method is called when your extension is deactivated
export function deactivate() { }

