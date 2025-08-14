import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

    test('Should have helloWorld command', async () => {
        const commands = await vscode.commands.getCommands(true);
        const hasCommand = commands.includes('flowriter.helloWorld');
        assert.ok(hasCommand, 'Command flowriter.helloWorld not found');
    });

    test('Should convert text to uppercase', async () => {
        const document = await vscode.workspace.openTextDocument({
            content: 'hello world',
            language: 'text'
        });
        await vscode.window.showTextDocument(document);

        const editApplied = new Promise<void>(resolve => {
            const disposable = vscode.workspace.onDidChangeTextDocument(e => {
                if (e.document === document) {
                    disposable.dispose();
                    resolve();
                }
            });
        });

        await vscode.commands.executeCommand('flowriter.toUpperCase');
        await editApplied;

        const text = document.getText();
        assert.strictEqual(text, 'HELLO WORLD');
    });
});