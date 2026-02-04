import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const create = mutation({
    args: {
        title: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        // Ideally we link this to the authenticated user
        const identity = await ctx.auth.getUserIdentity();

        // For now, we find the user via Clerk ID or just create an unlinked one if auth is optional (but schema says userId is required)
        // Let's query the user table first.
        let userId;

        if (identity) {
            const user = await ctx.db
                .query("users")
                .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
                .first();
            userId = user?._id;
        }

        if (!userId) {
            // Fallback or Error? Schema requires userId. 
            // If we are strictly auth-walled, we throw. 
            // For migration test, let's assume we grabbed the user from storeUser calls previously.
            // Actually, let's just fail if no user, as AuthContext should handle login.
            throw new Error("User must be logged in to create conversation");
        }

        const id = await ctx.db.insert("conversations", {
            userId: userId,
            startedAt: Date.now(),
            title: args.title || "New Session",
        });

        return id;
    },
});
