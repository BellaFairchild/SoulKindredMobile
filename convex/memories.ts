import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Helper to retrieve memories by ID (used by the chat action RAG flow)
export const getMemoriesByIds = query({
    args: { ids: v.array(v.id("memories")) },
    handler: async (ctx, args) => {
        const documents = [];
        for (const id of args.ids) {
            const doc = await ctx.db.get(id);
            if (doc) documents.push(doc);
        }
        return documents;
    },
});

export const saveMemory = mutation({
    args: {
        userId: v.id("users"),
        text: v.string(),
        embedding: v.array(v.number()),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("memories", {
            userId: args.userId,
            text: args.text,
            embedding: args.embedding,
            createdAt: Date.now(),
        });
    },
});

// Since we referenced api.messages.saveMessage in chat.ts, we define it here or in a messages.ts file.
// For simplicity/grouping, let's put message logic in a 'messages.ts' file if preferred,
// but often mutations can live alongside related domains.
// The user asked for "memories.ts", so let's stick to memory logic here.
