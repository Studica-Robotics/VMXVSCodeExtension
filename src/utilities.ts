'use strict';
import * as fs from 'fs';

import * as path from 'path';
import * as util from 'util';
import * as vscode from 'vscode';


// General utilites usable by multiple classes

export function getIsWindows(): boolean {
  const nodePlatform: NodeJS.Platform = process.platform;
  return nodePlatform === 'win32';
}

export function getIsMac(): boolean {
  const nodePlatform: NodeJS.Platform = process.platform;
  return nodePlatform === 'darwin';
}

export async function getClassName(): Promise<string | undefined> {
  const promptString = 'Please enter a class name';
  const className = await vscode.window.showInputBox({
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
}

export async function getPackageName(): Promise<string | undefined> {
  const promptString = 'Please enter a package name';
  const packageName = await vscode.window.showInputBox({
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
}

export const readFileAsync = util.promisify(fs.readFile);

export const writeFileAsync = util.promisify(fs.writeFile);

export const copyFileAsync = util.promisify(fs.copyFile);

export const mkdirAsync = util.promisify(fs.mkdir);

export const existsAsync = util.promisify(fs.exists);

export const deleteFileAsync = util.promisify(fs.unlink);


export const readdirAsync = util.promisify(fs.readdir);

export let javaHome: string | undefined;
export function setJavaHome(jhome: string): void {
  javaHome = jhome;
}



export let extensionContext: vscode.ExtensionContext;
export function setExtensionContext(context: vscode.ExtensionContext): void {
  extensionContext = context;
}



