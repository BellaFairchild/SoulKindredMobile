import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUser = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            return null;
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .first();

        return user;
    },
});

export const storeUser = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called storeUser without authentication detected");
        }

        // Check if user exists
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (user !== null) {
            // If we see a new ID, we could patch it here
            if (user.clerkId !== identity.subject) {
                await ctx.db.patch(user._id, { clerkId: identity.subject });
            }
            return user._id;
        }

        // Create new user
        return await ctx.db.insert("users", {
            name: identity.name,
            email: identity.email!,
            clerkId: identity.subject,
            createdAt: Date.now(),
            preferences: {
                theme: "dark",
                voiceId: "21m00Tcm4TlvDq8ikWAM",
            }
        });
    });
    },
});

export const completeOnboarding = mutation({
    args: {
        name: v.optional(v.string()),
        ageRange: v.optional(v.string()),
        language: v.optional(v.string()),
        companion: v.optional(v.any()),
        preferences: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthenticated");

        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
            .first();

        if (!user) throw new Error("User not found");

        await ctx.db.patch(user._id, {
            name: args.name || user.name,
            ageRange: args.ageRange,
            language: args.language,
            onboardingComplete: true,
            companion: args.companion,
            preferences: { ...user.preferences, ...args.preferences },
        });
    },
});
