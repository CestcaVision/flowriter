import * as vscode from 'vscode';
import { getDefinition } from './toDefinition';
import { getTranslation } from './getTranslation';

// Helper function to handle the command logic
async function handleApiCommand(apiFunction: (word: string) => Promise<string | null>, word: string, originalRange: vscode.Range, completionLabel: string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage('No active text editor to apply the result to.');
        return;
    }

    // The range that includes the original word, the dot, and the text inserted by the completion item.
    const endPosition = originalRange.end.translate(0, completionLabel.length);
    const finalRangeToReplace = new vscode.Range(originalRange.start, endPosition);

    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Fetching result for ${word}...`,
        cancellable: false
    }, async (_progress) => {
        const result = await apiFunction(word);
        const edit = new vscode.WorkspaceEdit();
        if (result) {
            // If we got a result, replace the entire range (e.g., "word.definition") with it.
            edit.replace(editor.document.uri, finalRangeToReplace, result);
        } else {
            // If the API fails or returns nothing, at least delete the inserted completion label.
            const cleanupRange = new vscode.Range(originalRange.end, endPosition);
            edit.delete(editor.document.uri, cleanupRange);
        }
        await vscode.workspace.applyEdit(edit);
    });
}

export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "shotwrite" is now active!');

    // Register the helloWorld command
    const helloWorldDisposable = vscode.commands.registerCommand('shotwrite.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from shotwrite!');
    });

    // --- Register Commands for Completion Items ---
    const definitionCommandDisposable = vscode.commands.registerCommand('shotwrite.getDefinitionCommand', (word: string, range: vscode.Range, label: string) => {
        handleApiCommand(getDefinition, word, range, label);
    });

    const translationCommandDisposable = vscode.commands.registerCommand('shotwrite.getTranslationCommand', (word: string, range: vscode.Range, label: string) => {
        handleApiCommand(getTranslation, word, range, label);
    });

    // --- Register Completion Item Provider ---
    const completionProviderDisposable = vscode.languages.registerCompletionItemProvider(
        ['typescript', 'javascript', 'python', 'html', 'css', 'json', 'markdown'], // Apply to these languages
        {
            provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
                
                const linePrefix = document.lineAt(position).text.substring(0, position.character);
                if (!linePrefix.endsWith('.')) {
                    return undefined;
                }

                const wordRange = document.getWordRangeAtPosition(position.with(undefined, position.character - 1));
                if (!wordRange) {
                    return undefined;
                }
                const word = document.getText(wordRange);
                
                // The range to be replaced includes the word and the dot
                const rangeToReplace = new vscode.Range(wordRange.start, position);

                const definitionItem = new vscode.CompletionItem('definition', vscode.CompletionItemKind.Method);
                definitionItem.command = {
                    command: 'shotwrite.getDefinitionCommand',
                    title: 'Get Definition',
                    arguments: [word, rangeToReplace, 'definition']
                };

                const translationItem = new vscode.CompletionItem('translation', vscode.CompletionItemKind.Method);
                translationItem.command = {
                    command: 'shotwrite.getTranslationCommand',
                    title: 'Get Translation',
                    arguments: [word, rangeToReplace, 'translation']
                };

                return [definitionItem, translationItem];
            }
        },
        '.' // Trigger character
    );

    context.subscriptions.push(
        helloWorldDisposable,
        definitionCommandDisposable,
        translationCommandDisposable,
        completionProviderDisposable
    );
}

export function deactivate() {}
