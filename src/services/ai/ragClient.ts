const RAG_URL = process.env.EXPO_PUBLIC_RAG_URL ?? 'https://example.com/rag';

export type RagResponse = {
  summary: string;
  sources: string[];
};

export const queryRag = async (question: string): Promise<RagResponse> => {
  try {
    const response = await fetch(`${RAG_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    if (!response.ok) throw new Error('RAG lookup failed');
    return (await response.json()) as RagResponse;
  } catch (error) {
    console.warn('RAG fallback', error);
    return {
      summary: 'No knowledge base connected yet, but I am ready when you are.',
      sources: [],
    };
  }
};
