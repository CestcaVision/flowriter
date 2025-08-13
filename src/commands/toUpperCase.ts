
import * as vscode from 'vscode';

export function toUpperCaseCommand() {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        const document = editor.document;
        const selection = editor.selection;

        // Get the text within the selection or the entire document if there is no selection.
        const text = document.getText(selection.isEmpty ? undefined : selection);
        
        const upperCaseText = text.toUpperCase();

        editor.edit(editBuilder => {
            if (selection.isEmpty) {
                const fullRange = new vscode.Range(
                    document.positionAt(0),
                    document.positionAt(document.getText().length)
                );
                editBuilder.replace(fullRange, upperCaseText);
            } else {
                editBuilder.replace(selection, upperCaseText);
            }
        });
    } else {
        vscode.window.showErrorMessage('No active editor found!');
    }
}
