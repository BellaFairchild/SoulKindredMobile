Antigravity Skill: Convex Migration for SoulKindred
Context & Goals
App: SoulKindred (Wellness AI Companion)

Mission: Fully migrate backend from Firebase/Pinecone to Convex.

Constraint: Maintain the low-latency real-time feel required for 3D avatar interaction.

Integrations: Clerk (Auth), Claude 3.5 (LLM), ElevenLabs (Voice), Convex Vector Search (Memory).

Execution Steps for the Agent
1. Environment Initialization
Run npx convex dev to initialize the project.

Configure environment variables in the Convex dashboard for CLERK_JWT_ISSUER_DOMAIN, ANTHROPIC_API_KEY, and ELEVENLABS_API_KEY.

2. Data Modeling (The Schema)
Create convex/schema.ts defining tables for users, conversations, and memories.

Critical: Implement the vectorIndex on the memories table using 1536 dimensions (or the specific dimension required by your embedding model).

3. Porting Logic to Actions & Mutations
Action (convex/chat.ts): Orchestrate the flow.

Retrieve relevant memory via db.query().withIndex("by_embedding")...

Call Claude 3.5 Sonnet via fetch.

Stream response (or handle complete response) to the frontend.

Mutation (convex/memories.ts): Save new interactions to the Vector Search index.

Query (convex/users.ts): Fetch user preferences and "Zen Session" history.

4. React Native Integration
Install @convex-dev/react-native and expo-secure-store.

Replace the Firebase AuthProvider with ConvexAuthProvider (configured with Clerk).

Refactor ChatScreen.tsx to use useQuery and useAction instead of current WebSocket/Firestore listeners.