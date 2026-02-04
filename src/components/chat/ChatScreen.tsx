import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/context/AppTheme';
import { useChat } from '@/hooks/useChat';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useAuth } from '@/auth/useAuth';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useSubscription } from '@/context/SubscriptionContext';
import { useVoiceEnergy } from '@/hooks/useVoiceEnergy';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, Easing } from 'react-native-reanimated';
import ChatBubble from './ChatBubble';

import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM_MARGIN } from '@/constants/layout';
import { useAppStore } from '@/state/store';
import { SCENES } from '@/utils/constants';
import SceneSelector from '@/components/chat/SceneSelector';
import { Image } from 'react-native';

export default function ChatScreen() {
  const { theme } = useTheme() as any;
  const insets = useSafeAreaInsets();

  // Header is absolute ~64pt height.
  const headerHeight = 64;
  // TabBar overhangs bottom by ~88pt total.
  const bottomOffset = TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_MARGIN;

  // Hooks
  const { messages, isLoading, sendMessage, addSystemMessage } = useChat();
  const { startRecording, stopRecording, isRecording, isProcessing: isTranscribing } = useVoiceRecorder();
  const { user } = useAuth();
  const { speak, stop: stopSpeaking, isSpeaking } = useTextToSpeech();
  const { isPremium } = useSubscription();

  const { energy, isTired, checkReset, refill } = useVoiceEnergy();

  // Check for day reset
  useEffect(() => {
    checkReset();
  }, []);

  useEffect(() => {
    if (energy <= 0 || isTired) {
      console.log("Force refilling energy for testing...");
      refill();
    }
  }, [energy, isTired]);

  // Notify when tired (Legacy check, mostly irrelevant if unlimited now)
  useEffect(() => {
    if (!isPremium && isTired && energy > 0) { // Only if genuinely tired and not just 0 glitch
      addSystemMessage("My voice is a little tired, but I can still text! Want to keep chatting?");
    }
  }, [isTired, isPremium]);

  // Animation Values
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.5);

  useEffect(() => {
    if (isRecording) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: 1000, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.in(Easing.ease) })
        ),
        -1,
        true
      );
      pulseOpacity.value = withRepeat(
        withSequence(withTiming(0.2, { duration: 1000 }), withTiming(0.5, { duration: 1000 })),
        -1,
        true
      );
    } else {
      pulseScale.value = withTiming(1);
      pulseOpacity.value = withTiming(0);
    }
  }, [isRecording]);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  // Local State
  const [inputText, setInputText] = useState('');
  const [isHandsFree, setIsHandsFree] = useState(false);
  const [sceneSelectorVisible, setSceneSelectorVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const currentSceneId = useAppStore(state => state.currentSceneId);

  // Get active scene object
  const activeScene = SCENES.find(s => s.id === currentSceneId);

  // Monitor Speaking State for Hands-Free Loop
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    // Debug Log
    if (isHandsFree) {
      console.log("Hands-Free Check:", { isSpeaking, isRecording, msgCount: messages.length });
    }

    // If Hands-Free is ON, we are NOT speaking, and NOT recording...
    // ...and we have messages (meaning the AI likely just finished replying)
    if (isHandsFree && !isSpeaking && !isRecording && messages.length > 0) {
      const lastMsg = messages[0];
      // Only auto-record if the last message was from AI (user: 2)
      if (lastMsg.user._id === 2 && !lastMsg.text.includes("...")) {
        console.log("Hands-Free: Auto-starting recording in 1200ms...");
        // Add a small delay so it doesn't cut in instantly
        timeout = setTimeout(() => {
          // Double check conditions haven't changed
          if (isHandsFree && !isSpeaking && !isRecording) {
            console.log("Hands-Free: Starting Recording NOW.");
            startRecording((text) => {
              // This callback runs when VAD detects silence and finishes transcribing
              console.log("Hands-Free: Received text:", text);
              if (text && text.trim()) {
                sendMessage(text);
              }
            });
          }
        }, 500);
      }
    }
    return () => clearTimeout(timeout);
  }, [isSpeaking, isRecording, isHandsFree, messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }
  }, [messages]);

  // Auto-speak AI messages
  useEffect(() => {
    const lastMsg = messages[0];
    if (lastMsg && lastMsg.user._id === 2 && !isSpeaking) {
      speak(lastMsg.text);
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  const handleMicPress = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      stopSpeaking(); // Stop TTS if speaking
      startRecording((text) => {
        if (text && text.trim()) {
          sendMessage(text);
        } else {
          // Give feedback if nothing was heard
          Alert.alert("I couldn't hear you", "Please try speaking closer to the microphone.");
        }
      });
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      Alert.alert("Image Selected", "Sharing images with your companion is simulated for now! 📸");
      // meaningful placeholder to show interaction
      sendMessage("[Shared an image]");
    }
  };

  const isLight = theme.mode === 'light';

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.appBackground }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 30}
    >
      {/* Dynamic Background */}
      {activeScene ? (
        <View style={StyleSheet.absoluteFill}>
          <Image
            source={activeScene.image}
            style={[StyleSheet.absoluteFill, { width: '100%', height: '100%', opacity: 1 }]}
            resizeMode="cover"
          />
          {/* Tint Overlay for Readability */}
          <View style={[StyleSheet.absoluteFill, { backgroundColor: isLight ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.4)' }]} />
        </View>
      ) : (
        <LinearGradient colors={[theme.appBackground, isLight ? '#f0f9ff' : '#0f172a']} style={StyleSheet.absoluteFill} />
      )}

      {/* Top Spacer for Absolute Header */}
      <View style={{ height: insets.top + headerHeight }} />

      {/* Messages or Empty State */}
      {messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconCircle, { backgroundColor: isLight ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.05)' }]}>
            <Ionicons name="sparkles" size={48} color={theme.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: theme.text }]}>Soul Kindred</Text>
          <Text style={[styles.emptySubtitle, { color: theme.secondary }]}>
            I'm here to listen, support, and grow with you.
          </Text>
          <Text style={[styles.emptyTip, { color: theme.secondary }]}>
            Say "Hello" or tap the microphone to start.
          </Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ChatBubble
              message={item.text}
              isUser={item.user._id === 1}
            />
          )}
          style={styles.list}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20, paddingTop: 20 }}
          inverted
        />
      )}

      {isLoading && messages.length > 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.accent} />
          <Text style={[styles.loadingText, { color: theme.secondary }]}>Thinking...</Text>
        </View>
      )}

      {/* Debug: Test Voice Button */}
      <Pressable
        style={{ alignSelf: 'center', marginVertical: 10, padding: 8, backgroundColor: '#333', borderRadius: 8 }}
        onPress={() => speak("This is a test of the voice system.")}
      >
        <Text style={{ color: '#4ade80', fontSize: 10, fontWeight: 'bold' }}>Test Voice (Updated)</Text>
      </Pressable>

      {/* Input Bar */}
      <BlurView
        intensity={isLight ? 30 : 20}
        style={[
          styles.inputContainer,
          {
            paddingBottom: insets.bottom + bottomOffset + 80,
            paddingTop: 16,
            borderColor: '#A855F7',
            flexDirection: 'column', // Changed to column to stack bar
            gap: 12,
            alignItems: 'stretch'
          }
        ]}
      >
        {/* Voice Energy Bar (Free Only) */}
        {!isPremium && (
          <View style={{ marginBottom: 4 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ fontSize: 10, color: theme.secondary, fontWeight: '700', letterSpacing: 1 }}>VOICE ENERGY</Text>
              <Text style={{ fontSize: 10, color: theme.secondary }}>{Math.round(energy)}%</Text>
            </View>
            <View style={{ height: 4, backgroundColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
              <View style={{
                width: `${energy}%`,
                height: '100%',
                backgroundColor: energy < 20 ? '#ef4444' : theme.primary
              }} />
            </View>
          </View>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

          {/* Hands Free Toggle (Premium Check REMOVED for Testing) */}
          <Pressable
            hitSlop={10} // Easier to tap
            onPress={() => {
              console.log("Hands-Free Toggle Pressed! Current State:", isHandsFree);
              // TEMPORARY: Unlocked for testing
              setIsHandsFree(!isHandsFree);
              if (!isHandsFree) {
                Alert.alert("Hands-Free Active", "I'll keep listening after I reply, so you can just talk!");
              }
            }}
            style={[styles.iconBtn, { marginRight: 8, opacity: isHandsFree ? 1 : 0.6 }]}
          >
            <Ionicons
              name={isHandsFree ? "infinite" : "headset-outline"}
              size={24}
              color={isHandsFree ? theme.primary : theme.secondary}
            />
          </Pressable>

          {/* Share Image Button */}
          <Pressable
            onPress={handlePickImage}
            style={[styles.iconBtn, { marginRight: 8 }]}
          >
            <Ionicons name="images-outline" size={24} color={theme.secondary} />
          </Pressable>

          {/* Scene Selector Button (New) */}
          <Pressable
            onPress={() => setSceneSelectorVisible(true)}
            style={[styles.iconBtn, { marginRight: 8 }]}
          >
            <Ionicons name="earth" size={24} color={theme.secondary} />
          </Pressable>

          <TextInput
            style={[styles.input, {
              backgroundColor: isLight ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.08)',
              color: theme.text,
            }]}
            placeholder={isRecording ? "Listening..." : "Type a message..."}
            placeholderTextColor={theme.secondary}
            value={inputText}
            onChangeText={setInputText}
            editable={!isRecording}
          />

          {inputText.length > 0 ? (
            <Pressable onPress={handleSend} style={[styles.sendBtn, { backgroundColor: theme.primary }]}>
              <Ionicons name="arrow-up" size={20} color="#fff" />
            </Pressable>
          ) : (
            <Pressable
              onPress={isTired && !isPremium ? () => {
                Alert.alert("Voice Energy Depleted", "Upgrade to Premium for unlimited voice chat.");
              } : handleMicPress}

              style={[
                styles.micBtn,
                {
                  // User Request: Green when ON (Recording), Red when OFF (Idle)
                  // We keep the 'disabled' check for tired logic if needed, but per request strictly:
                  backgroundColor: isRecording
                    ? '#22c55e' // Green (On)
                    : (isTired && !isPremium) ? theme.disabled : '#ef4444', // Red (Off)
                  zIndex: 9999 // Ensure button is clickable above everything
                }
              ]}
            >
              {/* Purple Pulse Animation Layer */}
              {isRecording && (
                <Animated.View
                  pointerEvents="none"
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      backgroundColor: '#a855f7', // Purple-500
                      borderRadius: 20,
                      zIndex: -1,
                    },
                    animatedPulseStyle
                  ]}
                />
              )}
              {/* Second Ring for visual complexity */}
              {isRecording && (
                <Animated.View
                  pointerEvents="none"
                  style={[
                    StyleSheet.absoluteFill,
                    {
                      borderColor: '#d8b4fe', // Purple-300
                      borderWidth: 2,
                      borderRadius: 20,
                      zIndex: -2,
                      transform: [{ scale: 1.2 }] // Static slightly larger ring
                    }
                  ]}
                />
              )}

              {isTranscribing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons
                  name={isRecording ? "stop" : (isTired && !isPremium ? "battery-dead" : "mic")}
                  size={22}
                  color="#fff" // Always white icon for contrast on colored backgrounds
                />
              )}
            </Pressable>
          )}

        </View>
      </BlurView>

      <SceneSelector
        visible={sceneSelectorVisible}
        onClose={() => setSceneSelectorVisible(false)}
      />

    </KeyboardAvoidingView >
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { flex: 1 },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10 },
  loadingText: { fontSize: 12 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 10,
  },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  micBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  iconBtn: { padding: 4 },

  // Empty State Styles
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    minHeight: 300,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  emptyTitle: {
    fontSize: 40,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 24,
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  emptyTip: {
    fontSize: 20,
    textAlign: 'center',
    opacity: 0.5,
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  }
});
