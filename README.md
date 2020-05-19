# VMXVSCodeExtension
Source code for VSCodeExtension to manage access to WPILibrary-based VMX-pi capabilities


# Installation
Download the latest .vsix file from the root folder of this repo
Open VSCode, in the Extensions window, find "Install from VSIX..."
Select the downloaded .vsix file to install

# Usage
The extension's commands can be accessed through the Command Pallete (opened with Ctrl+Shift+P)
All commands are located under the VMX-Pi category

`Update WPILib Version` updates the VMX-Pi specific WPILib library and GradleRIO to the latest version

`Change the deploy target to VMX-Pi (from RoboRIO)` adapts the project's build.gradle file to set a VMX-Pi target

`Change the deploy target to RoboRIO (from VMX-Pi)` adapts the project's build.gradle file to set a RoboRIO target
