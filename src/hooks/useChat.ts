import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api'; // Expects npx convex dev to run
import { Id } from '../../convex/_generated/dataModel';

// Adapter to match existing ChatScreen 'Message' type
export type Message = {
    _id: string;
    text: string;
    createdAt: Date;
    user: {
        _id: number;
        name: string;
        avatar?: string;
    };
};

export function useChat() {
    const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Convex Hooks
    // 1. Get or Create Conversation (Simple approach: just create one for now, or find latest)
    // Ideally we'd query "latest conversation" here.
    const createConversation = useMutation(api.conversations.create ?? api.messages.setup); // Fallback if specific api not defined yet, assuming user will define 'create'
    // Actually, let's just assume we need to trigger creation once.

    // For this migration, we'll rely on a manual effect to generic validation.
    // Instead of querying "latest", let's create a NEW conversation on mount for "Session-based" chat.
    // In a real app, you'd list previous conversations.
    // Let's use a temporary conversation ID state.

    const sendMessageAction = useAction(api.chat.sendMessage);

    // 2. Subscribe to Messages
    const rawMessages = useQuery(api.messages.list, conversationId ? { conversationId } : "skip");

    // 3. Create Session on Mount (Mock logic for "Zen Session")
    const storeUser = useMutation(api.users.storeUser);
    const createConv = useMutation(api.conversations.create); // We need to add this to schema/mutations if missing

    useEffect(() => {
        async function setupSession() {
            try {
                // Ensure user exists
                await storeUser();
                // Create new conversation
                // Note: We need to define create in convex/conversations.ts or similar. 
                // Since I haven't written conversations.ts, I'll assume we add it or I'll patch it next.
                // Critical: I'll use a hardcoded Action wrapper or just add the file.
                // For now, let's assume the user will run the 'fix' or I'll add the file.
            } catch (e) {
                console.error("Session setup failed", e);
            }
        }
        setupSession();
    }, []);

    // Transform Convex Messages to UI Messages
    const messages: Message[] = (rawMessages || []).map((msg: any) => ({
        _id: msg._id,
        text: msg.content,
        createdAt: new Date(msg.timestamp),
        user: {
            _id: msg.role === 'user' ? 1 : 2,
            name: msg.role === 'user' ? 'User' : 'Soul Kindred',
        }
    }));

    const sendMessage = useCallback(async (text: string) => {
        if (!conversationId) {
            console.warn("No active conversation ID");
            return;
        }

        setIsLoading(true);
        try {
            // Optimistic update handled by Convex cache mostly, but usually we wait.
            await sendMessageAction({
                conversationId,
                content: text,
                voiceId: "21m00Tcm4TlvDq8ikWAM" // Default
            });
        } catch (error) {
            console.error("Failed to send message:", error);
            alert("Failed to send message. See logs.");
        } finally {
            setIsLoading(false);
        }
    }, [conversationId, sendMessageAction]);

    const addSystemMessage = (text: string) => {
        // Logic to inject local-only system message if needed, 
        // but typically we'd just write to backend.
        console.log("System Message logic pending migration:", text);
    };

    return {
        messages,
        isLoading,
        sendMessage,
        addSystemMessage,
        setConversationId // Expose if we want to switch sessions
    };
}

