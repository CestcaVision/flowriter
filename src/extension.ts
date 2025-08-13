import * as vscode from 'vscode';
import { toUpperCaseCommand } from './commands/toUpperCase';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "shotwrite" is now active!');

	const helloWorldDisposable = vscode.commands.registerCommand('shotwrite.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from shotwrite!');
	});

	const toUpperCaseDisposable = vscode.commands.registerCommand('shotwrite.toUpperCase', toUpperCaseCommand);

	context.subscriptions.push(helloWorldDisposable, toUpperCaseDisposable);
}

export function deactivate() {}