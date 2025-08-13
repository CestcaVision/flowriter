import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "shotwrite" is now active!');

	const helloWorldDisposable = vscode.commands.registerCommand('shotwrite.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from shotwrite!');
	});

	const autoUpperCaseDisposable = vscode.workspace.onDidChangeTextDocument(event => {
		const changes = event.contentChanges[0];
		// Trigger condition: typing a single '.'
		if (changes.text === '.' && changes.rangeLength === 0) {
			const dotPosition = changes.range.start;
			const wordRange = event.document.getWordRangeAtPosition(dotPosition);

			if (wordRange) {
				const word = event.document.getText(wordRange);
				const upperWord = word.toUpperCase();

				const edit = new vscode.WorkspaceEdit();
				edit.replace(event.document.uri, wordRange, upperWord);
				vscode.workspace.applyEdit(edit);
			}
		}
	});

	context.subscriptions.push(helloWorldDisposable, autoUpperCaseDisposable);
}

export function deactivate() {}