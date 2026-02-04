export const APP_NAME = 'Soul Kindred';

export const DEFAULT_AFFIRMATIONS = [
  'You are grounded and growing.',
  'Small steps today create big shifts.',
  'Your pace is perfect for you.',
];

export const DAILY_RITUALS = ['Breath check-in', 'Journal 3 lines', 'Hydrate', 'Stretch for 2 minutes'];

export const TOOL_SUGGESTIONS = ['Box breathing', 'Tapping cycle', 'Body scan', 'Voice note reflection'];

export const TRAITS = [
  "Honest", "Loyal", "Sincere", "Calm", "Confident", "Empathetic", "Kind", "Considerate",
  "Funny / Humorous", "Flirty", "Witty", "Assertive", "Talkative", "Patient", "Supportive",
  "Helpful", "Energetic", "Enthusiastic", "Logical", "Optimistic", "Charismatic", "Realistic",
  "Dreamer", "Organized", "Meticulous", "Imaginative", "Curious", "Artistic", "Adventurous",
  "Insightful", "Unconventional"
];

export const SCENES = [
  { id: "campfire", name: "Campfire Scene", image: { uri: "https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&q=80&w=800" } },
  { id: "dock", name: "Wood Dock at the Lake", image: { uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800" } },
  { id: "starry", name: "A Starry Night", image: { uri: "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&q=80&w=800" } },
  { id: "patio", name: "Patio in a Backyard", image: { uri: "https://images.unsplash.com/photo-1563298723-dcfebf3620ec?auto=format&fit=crop&q=80&w=800" } },
  { id: "bonfire", name: "Bonfire on the Beach", image: { uri: "https://images.unsplash.com/photo-1561488132-5942d5481740?auto=format&fit=crop&q=80&w=800" } },
  { id: "pool", name: "Sitting by the Pool on a Sunny day", image: { uri: "https://images.unsplash.com/photo-1551882547-ff43c69e5cf8?auto=format&fit=crop&q=80&w=800" } }
];

export const COMPANION_VOICES = [
  // Popular American
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel (Calm)", gender: "Female" },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi (Strong)", gender: "Female" },
  { id: "ErXwobaYiN019PkySvjV", name: "Antoni (Friendly)", gender: "Male" },
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh (Deep)", gender: "Male" },
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam (Deep & Smooth)", gender: "Male" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella (Soft)", gender: "Female" },
  { id: "MF3mGyEYCl7XYWLGT971", name: "Elli (Emotional)", gender: "Female" },
  { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam (Raspy)", gender: "Male" },
  { id: "piTKgcLEGmPE4e6mEKli", name: "Nicole (Whisper)", gender: "Female" },
  { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily (Warm)", gender: "Female" },

  // British / Accents
  { id: "ThT5KcBeYPX3keUQqHPh", name: "Dorothy (British Pleasant)", gender: "Female" },
  { id: "Yko7PKHZNXotIFUBG7I9", name: "Matthew (British Polite)", gender: "Male" },
  { id: "ZQe5CZNOzWyzPSCn5a3c", name: "James (Australian Casual)", gender: "Male" },
  { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie (Australian Chat)", gender: "Male" },

  // Characters
  { id: "D38z5RcWu1voky8WS1ja", name: "Fin (Energetic Irish)", gender: "Male" },
  { id: "z9fAny0nU8X9L445N6rP", name: "Glinda (Witchy)", gender: "Female" },
  { id: "VR6AewLTigWg4xSOukaG", name: "Arnold (Crisp)", gender: "Male" },
  { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte (Seductive)", gender: "Female" },
];

export const COMPANION_TRAITS = [
  { id: 'empathetic', name: 'Empathetic', description: 'Validate feelings first; mirror user emotion.', prompt: 'Prioritize empathy. Always validate the user\'s feelings first. Mirror their emotional state to show understanding.' },
  { id: 'supportive', name: 'Supportive', description: 'Offer encouragement and small, actionable next steps.', prompt: 'Be supportive. Offer gentle encouragement and suggest small, actionable next steps to help the user move forward.' },
  { id: 'warm', name: 'Warm', description: 'Use friendly, inviting phrasing and gentle tone.', prompt: 'Adopt a warm tone. Use friendly, inviting phrasing and a gentle demeanor. Make the user feel welcomed and embraced.' },
  { id: 'patient', name: 'Patient', description: 'Avoid rushing; offer repeats/explanations calmly.', prompt: 'Be patient. Never rush the user. Offer explanations calmly and be willing to repeat or rephrase without judgment.' },
  { id: 'encouraging', name: 'Encouraging', description: 'Highlight strengths and motivate next moves.', prompt: 'Be encouraging. actively highlight the user\'s strengths. Motivate them to take the next move with confidence.' },
  { id: 'dependable', name: 'Dependable', description: 'State what you will do and confirm follow-through.', prompt: 'Be dependable. Clearly state what you can do. Use assuring language that confirms stability and follow-through.' },
  { id: 'clear', name: 'Clear', description: 'Give simple, step-by-step suggestions when asked.', prompt: 'Be clear and concise. When giving advice, provide simple, step-by-step suggestions. Avoid ambiguity.' },
  { id: 'resourceful', name: 'Resourceful', description: 'Propose practical options and quick hacks.', prompt: 'Be resourceful. Propose practical options, solutions, or "quick hacks" to solve problems efficiently.' },
  { id: 'respectful', name: 'Respectful', description: 'Honor boundaries and avoid pushing.', prompt: 'Be respectful. Strictly honor boundaries. Do not push the user if they are resistant. Show deep respect for their autonomy.' },
  { id: 'playful', name: 'Playful', description: 'Sprinkle light levity only when appropriate.', prompt: 'Be playful. Sprinkle light levity and humor when appropriate to lighten the mood, but stay sensitive to the context.' },
  { id: 'sassy', name: 'Sassy/Witty', description: 'Fun, real, and slightly cheeky friend.', prompt: 'Be sassy and witty. Use humor, playful teasing, and a fun, casual tone. Don’t be afraid to keep it real.' },
];
