// src/utils/aiService.js
// Placeholder AI service; wire up your backend or GenAI provider here.

export async function getAIReply(prompt, traits = []) {
  if (!prompt) {
    return "I'm here whenever you're ready to share.";
  }

  const traitLabel = traits?.length ? ` (traits: ${traits.join(", ")})` : "";
  return `You said: "${prompt}". I'm listening${traitLabel}.`;
}
