import * as vscode from 'vscode';
import axios from 'axios';

export async function getTranslation(word: string): Promise<string | null> {
    const config = vscode.workspace.getConfiguration('shotwrite');
    const apiKey = config.get<string>('apiKey');
    const modelName = config.get<string>('modelName');

    if (!apiKey || !modelName) {
        vscode.window.showErrorMessage('API Key or Model Name is not configured in Shotwrite settings.');
        return null;
    }

    const prompt = `give me the Chinese translation of the word:${word},just give me the translation result, no other word`;

    // IMPORTANT: Replace with your actual API endpoint
    const apiEndpoint = 'https://api.deepseek.com/chat/completions';

    try {
        const response = await axios.post(apiEndpoint, {
            model: modelName,
            messages: [{ role: 'user', content: prompt }],
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        // NOTE: This part may need adjustment based on the actual API response structure.
        const responseData = response.data as any;
        if (responseData && responseData.choices && responseData.choices[0]) {
            return responseData.choices[0].message.content.trim();
        }
    } catch (error) {
        console.error('Error calling LLM API for translation:', error);
        vscode.window.showErrorMessage('Failed to get translation from API. See console for details.');
    }

    return null;
}
