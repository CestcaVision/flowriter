
import { getLLMResponse } from '../llm';

export async function getTranslation(word: string): Promise<string | null> {
    const prompt = `give me the Chinese translation of the word:${word},just give me the translation result, no other word`;
    return getLLMResponse(prompt);
}
