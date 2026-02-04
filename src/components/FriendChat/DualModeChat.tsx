import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import WaveformView from './WaveformView';

type Message = {
  id: string;
  sender: 'you' | 'kindred';
  body: string;
};

export default function DualModeChat() {
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', sender: 'kindred', body: 'What do you need most right now?' },
  ]);

  const send = () => {
    if (!input.trim()) return;
    const outbound: Message = { id: Date.now().toString(), sender: 'you', body: input };
    setMessages((prev) => [...prev, outbound]);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.modeBar}>
        {(['text', 'voice'] as const).map((m) => (
          <Pressable
            key={m}
            style={[styles.modeChip, mode === m && styles.modeChipOn]}
            onPress={() => setMode(m)}
          >
            <Text style={[styles.modeText, mode === m && styles.modeTextOn]}>{m.toUpperCase()}</Text>
          </Pressable>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.bubble,
              msg.sender === 'you' ? styles.bubbleYou : styles.bubbleKindred,
            ]}
          >
            <Text style={styles.bubbleText}>{msg.body}</Text>
          </View>
        ))}
      </ScrollView>
      {mode === 'voice' ? (
        <View style={styles.voiceBox}>
          <Text style={styles.voiceLabel}>Voice capture</Text>
          <WaveformView />
        </View>
      ) : (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type to the Kindred Brain..."
            placeholderTextColor="#64748b"
          />
          <Pressable onPress={send} style={styles.sendButton}>
            <Text style={styles.sendLabel}>Send</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  modeBar: {
    flexDirection: 'row',
    gap: 8,
  },
  modeChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#0f172a',
  },
  modeChipOn: {
    backgroundColor: '#22c55e',
  },
  modeText: {
    color: '#cbd5e1',
    fontWeight: '600',
  },
  modeTextOn: {
    color: '#0b1220',
  },
  list: {
    gap: 10,
  },
  bubble: {
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
  },
  bubbleKindred: {
    backgroundColor: '#0f172a',
    alignSelf: 'flex-start',
  },
  bubbleYou: {
    backgroundColor: '#22c55e',
    alignSelf: 'flex-end',
  },
  bubbleText: {
    color: '#e2e8f0',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#0f172a',
    color: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  sendButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sendLabel: {
    color: '#0f172a',
    fontWeight: '700',
  },
  voiceBox: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    backgroundColor: '#0f172a',
    gap: 8,
  },
  voiceLabel: {
    color: '#cbd5e1',
    fontWeight: '600',
  },
});
