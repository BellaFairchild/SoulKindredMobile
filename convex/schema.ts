import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    // Users: Syncs with Clerk
    users: defineTable({
        clerkId: v.string(), // Unique index
        email: v.string(),
        name: v.optional(v.string()),
        createdAt: v.number(),

        // Profile & Onboarding
        ageRange: v.optional(v.string()),
        language: v.optional(v.string()),
        onboardingComplete: v.optional(v.boolean()),

        // Companion Config
        companion: v.optional(v.object({
            voiceId: v.optional(v.string()), // ElevenLabs ID
            name: v.optional(v.string()),
            personaPreset: v.optional(v.string()), // e.g. "The Stoic"
            traitSliders: v.optional(v.any()), // JSON blob for slider values
        })),

        // Preferences
        preferences: v.optional(v.object({
            theme: v.string(), // "day" | "night"
            soundEnabled: v.boolean(),
            notificationPrefs: v.optional(v.any()), // JSON blob
        })),

        // Monetization
        planTier: v.optional(v.string()), // "free" | "soul_plus"
    }).index("by_clerkId", ["clerkId"]),

    // Moods: Daily emotional logs
    moods: defineTable({
        userId: v.string(), // clerkId
        emotion: v.string(), // e.g. "Joy", "Anxious"
        intensity: v.number(), // 1-10
        note: v.optional(v.string()),
        sceneId: v.optional(v.string()), // Context of where it was logged
        timestamp: v.number(),
    })
        .index("by_userId", ["userId"])
        .index("by_userId_timestamp", ["userId", "timestamp"]),

    // Journals: Written or spoken entries
    journals: defineTable({
        userId: v.string(), // clerkId
        text: v.string(),
        audioFileId: v.optional(v.string()), // Reference to file storage
        tags: v.optional(v.array(v.string())),
        highlights: v.optional(v.any()), // JSON blob for extracted insights (Gratitude, etc.)
        timestamp: v.number(),
    })
        .index("by_userId", ["userId"])
        .index("by_userId_timestamp", ["userId", "timestamp"]),

    // Affirmations: Daily tracking
    affirmations: defineTable({
        userId: v.string(), // clerkId (if saving specific ones)
        text: v.string(),
        date: v.string(), // YYYY-MM-DD
        saved: v.boolean(),
    }).index("by_userId", ["userId"]),

    // Conversations: Tracks distinct chat sessions
    // Renamed 'sessions' in blueprint, mapping to 'conversations' for consistency with existing code
    conversations: defineTable({
        userId: v.string(), // clerkId
        startedAt: v.number(),
        updatedAt: v.optional(v.number()),
        title: v.optional(v.string()),
        safetyFlags: v.optional(v.array(v.string())),
    })
        .index("by_userId", ["userId"])
        .index("by_userId_updatedAt", ["userId", "updatedAt"]),

    // Messages: Individual chat bubbles
    messages: defineTable({
        conversationId: v.id("conversations"),
        userId: v.string(), // clerkId (or 'system'/'assistant')
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
        timestamp: v.number(),
        metadata: v.optional(v.any()), // Reactions, etc.
    }).index("by_conversationId", ["conversationId"]),

    // Memories: The "Brain" - stored as vector embeddings
    // Mapped to 'memory_facts' concept but kept flexible
    memories: defineTable({
        userId: v.string(), // clerkId
        type: v.string(), // "fact" | "chat_context" | "journal_insight"
        content: v.string(), // Text content
        embedding: v.optional(v.array(v.number())), // Vector for semantic search
        source: v.optional(v.string()),
        lastConfirmedAt: v.optional(v.number()),
        timestamp: v.number(),
    })
        .index("by_userId", ["userId"])
        .vectorIndex("by_embedding", {
            vectorField: "embedding",
            dimensions: 1536,
        }),

    // Lunchbox Drops: Daily gamification
    lunchbox_drops: defineTable({
        date: v.string(), // YYYY-MM-DD (Global or User Local?)
        content: v.any(), // JSON blob of 3 memes/quotes
    }).index("by_date", ["date"]),

    // Rewards: User inventory/unlocks from Lunchbox
    rewards: defineTable({
        userId: v.string(),
        itemType: v.string(), // "meme" | "cosmetic" | "capsule"
        payloadRef: v.string(), // ID or URL
        openedAt: v.number(),
    })
        .index("by_userId", ["userId"])
        .index("by_userId_openedAt", ["userId", "openedAt"]),

    // Vault Items: Saved content
    vault_items: defineTable({
        userId: v.string(),
        type: v.string(), // "meme" | "capsule"
        payload: v.any(),
        savedAt: v.number(),
    }).index("by_userId", ["userId"]),

    // Subscriptions: RevenueCat mirror
    subscriptions: defineTable({
        userId: v.string(),
        status: v.string(), // "active" | "expired"
        entitlements: v.array(v.string()), // ["soul_plus"]
        updatedAt: v.number(),
    }).index("by_userId", ["userId"]),
});
