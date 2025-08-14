import * as vscode from 'vscode';
import { getDefinition } from './toDefinition';
import { getTranslation } from './getTranslation';

// Define the decoration type for the placeholder text
const placeholderDecorationType = vscode.window.createTextEditorDecorationType({
    fontStyle: 'italic',
    color: new vscode.ThemeColor('editorHint.foreground')
});

// Helper function to handle the command logic
async function handleApiCommand(apiFunction: (word: string) => Promise<string | null>, word: string, originalRange: vscode.Range, completionLabel: string) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    // 1. Define the full range of text to be replaced initially.
    // This is the original word, the dot, and the text VS Code inserted (the completion label).
    const fullRangeToDelete = new vscode.Range(originalRange.start, originalRange.end.translate(0, completionLabel.length));

    // --- Animation & Placeholder Setup ---
    const placeholderLength = word.length;
    const animationChars = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';
    let animationOffset = 0;
    const getPlaceholderFrame = () => {
        const frame = (animationChars + animationChars).substring(animationOffset, animationOffset + placeholderLength);
        animationOffset = (animationOffset + 1) % animationChars.length;
        return frame;
    };

    // 2. Immediately replace the entire text (e.g., "word.definition") with the first animation frame.
    const firstFrame = getPlaceholderFrame();
    const initialEdit = new vscode.WorkspaceEdit();
    initialEdit.replace(editor.document.uri, fullRangeToDelete, firstFrame);
    await vscode.workspace.applyEdit(initialEdit);

    // 3. Start the animation loop
    let currentPlaceholderRange = new vscode.Range(fullRangeToDelete.start, fullRangeToDelete.start.translate(0, firstFrame.length));
    editor.setDecorations(placeholderDecorationType, [currentPlaceholderRange]);

    const animationInterval = setInterval(() => {
        const nextFrame = getPlaceholderFrame();
        const edit = new vscode.WorkspaceEdit();
        edit.replace(editor.document.uri, currentPlaceholderRange, nextFrame);
        vscode.workspace.applyEdit(edit);
    }, 150);

    // 4. Call API in the background
    const result = await apiFunction(word);

    // 5. Stop animation and clear decoration
    clearInterval(animationInterval);
    editor.setDecorations(placeholderDecorationType, []);

    // 6. Perform final replacement
    const finalEdit = new vscode.WorkspaceEdit();
    if (result) {
        finalEdit.replace(editor.document.uri, currentPlaceholderRange, result);
    } else {
        finalEdit.replace(editor.document.uri, currentPlaceholderRange, word); // Restore original word on failure
    }
    await vscode.workspace.applyEdit(finalEdit);
}

export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "shotwrite" is now active!');

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
        ['typescript', 'javascript', 'python', 'html', 'css', 'json', 'markdown'],
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
                
                // This is the range of "word."
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
