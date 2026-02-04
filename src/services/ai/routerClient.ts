const BASE_URL = process.env.EXPO_PUBLIC_BRAIN_API ?? 'https://example.com/brain';

export type BrainMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export class RouterClient {
  async sendMessage(message: BrainMessage): Promise<BrainMessage> {
    try {
      const response = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) throw new Error('Brain API request failed');
      const data = (await response.json()) as BrainMessage;
      return data;
    } catch (error) {
      console.warn('RouterClient fallback response', error);
      return { role: 'assistant', content: 'I am listening. Tell me what you need.' };
    }
  }

  async fetchTools(): Promise<string[]> {
    const response = await fetch(`${BASE_URL}/tools`).catch(() => undefined);
    if (!response?.ok) return [];
    const data = (await response.json()) as string[];
    return data;
  }
}
