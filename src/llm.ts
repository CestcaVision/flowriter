
import * as vscode from 'vscode';
import OpenAI from 'openai';

export async function getLLMResponse(prompt: string): Promise<string | null> {
    const config = vscode.workspace.getConfiguration('flowriter');
    const apiKey = config.get<string>('apiKey');
    const modelName = config.get<string>('modelName');
    const apiEndpoint = config.get<string>('apiEndpoint');

    if (!apiKey || !modelName || !apiEndpoint) {
        vscode.window.showErrorMessage('API Key, Model Name or API Endpoint is not configured in Flowriter settings.');
        return null;
    }

    const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: apiEndpoint
    });

    try {
        const response = await openai.chat.completions.create({
            model: modelName,
            messages: [
                { role: "user", content: prompt }
            ],
        }) as any;

        if (response && response.choices && response.choices[0]) {
            return response.choices[0].message.content.trim();
        }
    } catch (error) {
        console.error('Error calling LLM API:', error);
        vscode.window.showErrorMessage('Failed to get response from API. See console for details.');
    }

    return null;
}
