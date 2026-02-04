import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveMessage = mutation({
    args: {
        conversationId: v.id("conversations"),
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        // In a real app we might verify the user from ctx.auth
        // const identity = await ctx.auth.getUserIdentity();
        // const user = await ctx.db.query("users").withIndex("by_clerkId", ...).first();

        // Using a placeholder 'user' ID fetch or similar logic would go here
        // For now we just insert the message linked to conversation
        const conversation = await ctx.db.get(args.conversationId);
        if (!conversation) throw new Error("Conversation not found");

        await ctx.db.insert("messages", {
            conversationId: args.conversationId,
            userId: conversation.userId,
            role: args.role,
            content: args.content,
            timestamp: Date.now(),
        });
    },
});

export const list = query({
    args: { conversationId: v.id("conversations") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("messages")
            .withIndex("by_conversationId", (q) => q.eq("conversationId", args.conversationId))
            .order("desc") // timestamp sort if part of index or in-memory
            .take(50);
    },
});
