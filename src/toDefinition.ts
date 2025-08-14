import * as vscode from 'vscode';
import axios from 'axios';

export async function getDefinition(word: string): Promise<string | null> {
    const config = vscode.workspace.getConfiguration('flowriter');
    const apiKey = config.get<string>('apiKey');
    const modelName = config.get<string>('modelName');

    if (!apiKey || !modelName) {
        vscode.window.showErrorMessage('API Key or Model Name is not configured in Flowriter settings.');
        return null;
    }

    const prompt = `give me the definition of this word: ${word}, just give me the definition, no other words`;

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

        // Log the full response data for debugging
        console.log('Full API Response:', JSON.stringify(response.data, null, 2));

        const responseData = response.data as any;

        if (responseData && responseData.choices && responseData.choices[0]) {
            return responseData.choices[0].message.content.trim();
        }
    } catch (error) {
        console.error('Error calling LLM API:', error);
        vscode.window.showErrorMessage('Failed to get definition from API. See console for details.');
    }

    return null;
}
