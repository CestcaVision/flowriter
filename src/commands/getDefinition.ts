
import { getLLMResponse } from '../llm';

export async function getDefinition(word: string): Promise<string | null> {
    const prompt = `give me the definition of this word: ${word}, just give me the definition, no other words`;
    return getLLMResponse(prompt);
}
