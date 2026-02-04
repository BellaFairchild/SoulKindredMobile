import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";

export const sendMessage = action({
    args: {
        content: v.string(),
        conversationId: v.id("conversations"),
        voiceId: v.optional(v.string()), // Optional override
    },
    handler: async (ctx, args) => {
        // 1. Generate Query Embedding (using OpenAI for consistency with vector index)
        // We reuse the embedding action from memories (defined later) or call OpenAI directly here for speed
        const embeddingResponse = await fetch("https://api.openai.com/v1/embeddings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                input: args.content,
                model: "text-embedding-3-small",
            }),
        });

        const embeddingJson = await embeddingResponse.json();
        const embedding = embeddingJson.data[0].embedding;

        // 2. Vector Search (RAG)
        // Find relevant memories
        const results = await ctx.vectorSearch("memories", "by_embedding", {
            vector: embedding,
            limit: 3,
        });

        // Fetch the actual text for these memories
        const memoryDocs = await ctx.runQuery(api.memories.getMemoriesByIds, {
            ids: results.map(r => r._id)
        });

        const contextText = memoryDocs.map(doc => doc?.text).join("\n---\n");

        // 3. Call Claude 3.5 Sonnet
        const systemPrompt = `You are a spiritual companion named Soul Kindred.
    Context from previous conversations or memories:
    ${contextText}
    
    Respond with empathy and wisdom. Keep it concise.`;

        const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "x-api-key": process.env.ANTHROPIC_API_KEY!,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json",
            },
            body: JSON.stringify({
                model: "claude-3-5-sonnet-20240620",
                max_tokens: 1024,
                messages: [
                    { role: "system", content: systemPrompt }, // Claude 3.5 supports system param or user message
                    { role: "user", content: args.content }
                ]
            }),
        });

        if (!claudeResponse.ok) {
            throw new Error(`Claude API Error: ${claudeResponse.statusText}`);
        }

        const claudeJson = await claudeResponse.json();
        const replyText = claudeJson.content[0].text;

        // 4. Save both User Message and Assistant Reply
        await ctx.runMutation(api.messages.saveMessage, {
            conversationId: args.conversationId,
            role: "user",
            content: args.content
        });

        await ctx.runMutation(api.messages.saveMessage, {
            conversationId: args.conversationId,
            role: "assistant",
            content: replyText
        });

        // 5. Asynchronously embed and save this new interaction as a 'Memory' if significant?
        // For now, we return the text so the client can speak it.
        return {
            text: replyText,
        };
    },
});
