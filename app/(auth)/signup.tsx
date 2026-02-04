import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
    Image,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { useAuth } from '@/auth/useAuth';
import { Ionicons } from '@expo/vector-icons';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthButton from '@/components/auth/AuthButton';
import PickerCard from '@/components/auth/PickerCard';
import { LinearGradient } from 'expo-linear-gradient';
// import { speakReply } from '@/utils/voiceService';
import { useSoulKindred } from '@/state/useSoulKindred';
import SoulLoader from '@/components/tools/SoulLoader';

const { width } = Dimensions.get('window');

type SignupStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export default function SignupScreen() {
    const [step, setStep] = useState<SignupStep>(1);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // New Personalization State
    const [companionType, setCompanionType] = useState<'female' | 'male' | 'non-binary' | null>(null);
    const [avatarId, setAvatarId] = useState<string | null>(null);
    const [aiName, setAiName] = useState('');
    const [ageRange, setAgeRange] = useState<string | null>(null);
    const [language, setLanguage] = useState('English (US)');
    // Personality State with Points (1-10)
    const [personality, setPersonality] = useState<Record<string, number>>({});
    const [voiceId, setVoiceId] = useState('21m00Tcm4TlvDq8ikWAM'); // Default: Rachel
    const [previewing, setPreviewing] = useState<string | null>(null);
    const [themeId, setThemeId] = useState('cabin');
    const [planId, setPlanId] = useState<'free' | 'premium'>('premium');
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);

    const [error, setError] = useState('');

    const { signup, signInWithGoogle, signInWithFacebook } = useAuth();
    const { setUser, setFriend } = useSoulKindred();
    const router = useRouter();

    const handleContinue = () => {
        setError('');
        if (step === 1) {
            if (!username || !email) {
                setError('Please fill in all fields');
                return;
            }
            setStep(2);
        } else if (step === 2) {
            setStep(3);
        } else if (step === 3) {
            if (!password || password.length < 6) {
                setError('Password must be at least 6 characters');
                return;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
            setStep(4);
        } else if (step === 4) {
            if (!companionType) {
                setError("Please choose a companion type");
                return;
            }
            setStep(5);
        } else if (step === 5) {
            if (!ageRange) {
                setError("Please select your age range");
                return;
            }
            setStep(6);
        } else if (step === 6) {
            setStep(7);
        } else if (step === 7) {
            if (!aiName) {
                setError("Please name your AI friend");
                return;
            }
            setStep(8);
        } else if (step === 8) {
            if (Object.keys(personality).length === 0) {
                setError("Please pick at least one trait");
                return;
            }
            setStep(9);
        } else if (step === 9) {
            handleFinalSignup();
        }
    };

    const handleFinalSignup = async () => {
        try {
            setError('');
            console.log('Starting Signup Process...');
            setIsSigningUp(true);

            const profileData = {
                username,
                companionType,
                avatarId,
                aiName,
                ageRange,
                language,
                personality,
                voiceId,
                themeId,
                planId,
                billingCycle
            };

            // Persist to local state
            setFriend({
                id: avatarId || undefined,
                glbUrl: avatarId ? `https://models.readyplayer.me/${avatarId}.glb` : undefined,
                personality,
                voiceId
            });
            setUser({ name: username });

            console.log('Calling auth.signup...');
            await signup(email.trim(), password, profileData);
            console.log('Signup successful!');
            setIsSigningUp(false);
            setShowSuccess(true);
        } catch (e: any) {
            console.error(e);
            setIsSigningUp(false);
            if (e.code === 'auth/email-already-in-use') {
                setError('This email is already registered. Please Log In.');
            } else if (e.code === 'auth/weak-password') {
                setError('Password is too weak. Please use at least 6 characters.');
            } else if (e.code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else {
                setError(e.message.replace('Firebase: Error (', '').replace(').', ''));
            }
        }
    };

    const renderSuccess = () => (
        <View style={styles.successContainer}>
            <View style={styles.successCrown}>
                <LinearGradient
                    colors={['#5ED5FF', '#F922FF']}
                    style={{ width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Ionicons name="ribbon" size={40} color="#fff" />
                </LinearGradient>
            </View>

            <Text style={styles.successTitle}>Welcome to{"\n"}Premium!</Text>
            <Text style={styles.successSubtitle}>
                Get ready for deeper connections, unlimited conversations, and exclusive scenes. Your best friend just got even better.
            </Text>

            <Text style={styles.vipBadge}>You're a Soul Kindred VIP</Text>

            <View style={[styles.premiumFeatures, { width: '100%', paddingBottom: 40 }]}>
                {[
                    'Unlimited Voice Chat',
                    'Advanced Memory Retention',
                    'Access All 12+ Scenes'
                ].map((feature, i) => (
                    <View key={i} style={[styles.featureRow, { justifyContent: 'center' }]}>
                        <View style={styles.featureCheckActive}>
                            <Ionicons name="checkmark" size={16} color="#24D18B" />
                        </View>
                        <Text style={[styles.featureText, { flex: 0 }]}>{feature}</Text>
                    </View>
                ))}
            </View>

            <TouchableOpacity
                style={[styles.trialButton, { marginBottom: 16 }]}
                onPress={() => router.replace('/')}
            >
                <LinearGradient
                    colors={['#4CC9F0', '#F922FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.trialButtonGradient}
                >
                    <Text style={styles.trialButtonText}>Start Chatting Now</Text>
                </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.freemiumCard, { justifyContent: 'center', marginBottom: 0, height: 64, borderRadius: 32 }]}
                onPress={() => router.replace('/')}
            >
                <Text style={[styles.toggleLabelActive, { fontSize: 16 }]}>Back to Home</Text>
            </TouchableOpacity>
        </View>
    );

    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <View style={styles.avatarContainer}>
                <LinearGradient
                    colors={['#FFADF4', '#F922FF']}
                    style={styles.avatarGlow}
                >
                    <View style={styles.avatarInner}>
                        <Ionicons name="sparkles" size={40} color="#F922FF" />
                    </View>
                </LinearGradient>
            </View>

            <Text style={styles.megaTitle}>Let's Connect</Text>
            <Text style={styles.subtitle}>Create your account to meet your new best friend.</Text>

            <View style={styles.inputGroup}>
                <TextInput
                    style={styles.inputUnderline}
                    placeholder="Email/Mobile"
                    placeholderTextColor="rgba(0,0,0,0.3)"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputGroup}>
                <TextInput
                    style={styles.inputUnderline}
                    placeholder="Username"
                    placeholderTextColor="rgba(0,0,0,0.3)"
                    value={username}
                    onChangeText={setUsername}
                />
                <View style={styles.hintContainer}>
                    <Ionicons name="information-circle" size={16} color="rgba(0,0,0,0.3)" />
                    <Text style={styles.hintText}>This is what your AI friend will call you.</Text>
                </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <AuthButton
                label="Continue"
                onPress={handleContinue}
                style={styles.marginV}
            />

            <AuthButton
                label="Google Login"
                onPress={signInWithGoogle}
                type="google"
                style={styles.marginB}
            />

            <AuthButton
                label="Facebook Login"
                onPress={signInWithFacebook}
                type="facebook"
            />

            <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <Link href="/login" asChild>
                    <TouchableOpacity>
                        <Text style={styles.linkText}>Log In</Text>
                    </TouchableOpacity>
                </Link>
            </View>

            <View style={styles.legalContainer}>
                <Text style={styles.legalText}>By creating an account, you agree to our</Text>
                <TouchableOpacity><Text style={styles.legalLink}>Terms of Service</Text></TouchableOpacity>
                <Text style={styles.legalText}>and</Text>
                <TouchableOpacity><Text style={styles.legalLink}>Privacy Policy</Text></TouchableOpacity>
            </View>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContainer}>
            <View style={styles.iconCircle}>
                <LinearGradient
                    colors={['#5ED5FF', '#F922FF']}
                    style={styles.gradientBox}
                />
            </View>

            <Text style={styles.title}>Verify it's you</Text>
            <Text style={styles.subtitle}>
                We've sent a 4-digit code to{' '}
                <Text style={{ fontWeight: '600', color: '#000' }}>{email || 'user@example.com'}</Text>
            </Text>
            <TouchableOpacity onPress={() => setStep(1)}>
                <Text style={styles.changeEmailText}>Change email?</Text>
            </TouchableOpacity>

            <View style={styles.otpContainer}>
                {['3', '', '', ''].map((digit, i) => (
                    <View key={i} style={[styles.otpBox, i === 0 && styles.otpBoxActive]}>
                        <Text style={styles.otpDigit}>{digit}</Text>
                    </View>
                ))}
            </View>

            <Text style={styles.resendText}>
                Resend code in <Text style={{ color: '#F922FF', fontWeight: 'bold' }}>00:41</Text>
            </Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <AuthButton
                label="Verify Account"
                onPress={handleContinue}
                style={styles.marginV}
            />

            <View style={styles.keypadDummy}>
                <Text style={styles.dummyText}>System Keyboard will appear here</Text>
            </View>
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.stepContainer}>
            <View style={styles.iconCircle}>
                <Ionicons name="lock-closed" size={48} color="#F922FF" />
            </View>
            <Text style={styles.title}>Secure your account</Text>
            <Text style={styles.subtitle}>Choose a strong password to protect your journey.</Text>

            <View style={styles.inputGroup}>
                <TextInput
                    style={styles.inputUnderline}
                    placeholder="Password"
                    placeholderTextColor="rgba(0,0,0,0.3)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>

            <View style={styles.inputGroup}>
                <TextInput
                    style={styles.inputUnderline}
                    placeholder="Confirm Password"
                    placeholderTextColor="rgba(0,0,0,0.3)"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <AuthButton
                label="Continue"
                onPress={handleContinue}
                style={styles.marginV}
            />
        </View>
    );

    const renderStep4 = () => (
        <View style={styles.stepContainer}>
            <View style={styles.iconCircleHeader}>
                <Ionicons name="transgender-outline" size={40} color="#F922FF" />
            </View>

            <Text style={styles.megaTitle}>Choose{"\n"}Companion Type</Text>
            <Text style={styles.subtitle}>
                This helps us shape their voice and personality to connect with you better.
            </Text>

            <PickerCard
                title="Female"
                description="Soft, nurturing, or energetic voice."
                selected={companionType === 'female'}
                onSelect={() => setCompanionType('female')}
                icon="woman-outline"
                iconBgColor="#FFF0F5"
            />

            <PickerCard
                title="Male"
                description="Calm, deep, or assertive voice."
                selected={companionType === 'male'}
                onSelect={() => setCompanionType('male')}
                icon="man-outline"
                iconBgColor="#F0F8FF"
            />

            <PickerCard
                title="Non-binary"
                description="Neutral tone, adaptable personality."
                selected={companionType === 'non-binary'}
                onSelect={() => setCompanionType('non-binary')}
                icon="male-female-outline"
                iconBgColor="#F0F0FF"
            />

            <View style={styles.infoRow}>
                <Text style={styles.infoText}>You can change this later in settings.</Text>
                <Ionicons name="information-circle" size={20} color="rgba(0,0,0,0.2)" />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <AuthButton
                label="Continue"
                onPress={handleContinue}
                style={styles.marginV}
            />
        </View>
    );

    const renderStep5 = () => (
        <View style={styles.stepContainer}>
            <View style={styles.iconCircleHeader}>
                <Ionicons name="gift-outline" size={40} color="#5ED5FF" />
            </View>

            <Text style={styles.megaTitle}>How old are you?</Text>
            <Text style={styles.subtitle}>
                This helps us personalize your Soul Kindred experience to match your life stage.
            </Text>

            <PickerCard
                title="14 - 18"
                description="High School / Teen"
                selected={ageRange === '14-18'}
                onSelect={() => setAgeRange('14-18')}
                icon="leaf-outline"
                iconBgColor="#E7F9EF"
            />

            <PickerCard
                title="18 - 30"
                description="Young Adult / Student"
                selected={ageRange === '18-30'}
                onSelect={() => setAgeRange('18-30')}
                icon="rocket-outline"
                iconBgColor="#EBF5FF"
            />

            <PickerCard
                title="30 - 40"
                description="Career / Family"
                selected={ageRange === '30-40'}
                onSelect={() => setAgeRange('30-40')}
                icon="briefcase-outline"
                iconBgColor="#F5EFFF"
            />

            <PickerCard
                title="50 - 60"
                description="Established / Reflective"
                selected={ageRange === '50-60'}
                onSelect={() => setAgeRange('50-60')}
                icon="wine-outline"
                iconBgColor="#FFF4EB"
            />

            <PickerCard
                title="Older"
                description="Wisdom / Leisure"
                selected={ageRange === 'older'}
                onSelect={() => setAgeRange('older')}
                icon="trail-sign-outline"
                iconBgColor="#E7F9F7"
            />

            <View style={styles.footerLock}>
                <Ionicons name="lock-closed" size={16} color="rgba(0,0,0,0.2)" />
                <Text style={styles.footerLockText}>Your age is kept private and used only for personalization.</Text>
            </View>

            <AuthButton
                label="Continue"
                onPress={handleContinue}
                style={styles.marginV}
            />
        </View>
    );

    const renderStep6 = () => (
        <View style={styles.stepContainer}>
            <View style={styles.iconCircleHeader}>
                <Ionicons name="globe-outline" size={40} color="#3062C8" />
            </View>

            <Text style={styles.megaTitle}>Choose Language?</Text>
            <Text style={styles.subtitle}>
                Soul Kindred will converse with you in your preferred language.
            </Text>

            <PickerCard
                variant="language"
                title="English (US)"
                description="Default"
                selected={language === 'English (US)'}
                onSelect={() => setLanguage('English (US)')}
                imageUrl="https://flagcdn.com/w80/us.png"
            />

            <PickerCard
                variant="language"
                title="English (UK)"
                selected={language === 'English (UK)'}
                onSelect={() => setLanguage('English (UK)')}
                imageUrl="https://flagcdn.com/w80/gb.png"
            />

            <PickerCard
                variant="language"
                title="Español"
                selected={language === 'Español'}
                onSelect={() => setLanguage('Español')}
                imageUrl="https://flagcdn.com/w80/es.png"
            />

            <PickerCard
                variant="language"
                title="Français"
                selected={language === 'Français'}
                onSelect={() => setLanguage('Français')}
                imageUrl="https://flagcdn.com/w80/fr.png"
            />

            <PickerCard
                variant="language"
                title="Deutsch"
                selected={language === 'Deutsch'}
                onSelect={() => setLanguage('Deutsch')}
                imageUrl="https://flagcdn.com/w80/de.png"
            />

            <TouchableOpacity style={styles.requestLanguage}>
                <Text style={styles.requestPrefix}>Don't see your language? </Text>
                <Text style={styles.requestLink}>Request it here</Text>
            </TouchableOpacity>

            <AuthButton
                label="Continue"
                onPress={handleContinue}
                style={styles.marginV}
            />
        </View>
    );

    const renderStep7 = () => (
        <View style={styles.stepContainer}>
            <View style={[styles.iconCircleHeader, { backgroundColor: '#3062C808' }]}>
                <Ionicons name="sparkles-outline" size={40} color="#3062C8" />
            </View>

            <Text style={styles.megaTitle}>Basics</Text>
            <Text style={styles.subtitle}>Name your companion and choose a starting location.</Text>

            <Text style={styles.inputLabel}>AI Friend Name</Text>
            <View style={styles.inputGroup}>
                <TextInput
                    style={styles.inputUnderline}
                    placeholder="e.g. Luna"
                    placeholderTextColor="rgba(0,0,0,0.3)"
                    value={aiName}
                    onChangeText={setAiName}
                />
            </View>

            <Text style={[styles.inputLabel, { marginTop: 32 }]}>Initial Theme (World)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.themeScroll}>
                {[
                    { id: 'cabin', name: 'Cozy Cabin', img: 'https://images.unsplash.com/photo-1449156001437-37c69b1df501?w=400' },
                    { id: 'scifi', name: 'Cyberpunk', img: 'https://images.unsplash.com/photo-1605806616949-1e87b487fc2f?w=400' },
                    { id: 'nature', name: 'Forest', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400' }
                ].map(theme => (
                    <TouchableOpacity
                        key={theme.id}
                        onPress={() => setThemeId(theme.id)}
                        style={[styles.themeCard, themeId === theme.id && styles.themeCardSelected]}
                    >
                        <Image source={{ uri: theme.img }} style={styles.themeImg} />
                        <View style={styles.themeOverlay}>
                            <Text style={styles.themeName}>{theme.name}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <AuthButton
                label="Continue"
                onPress={handleContinue}
                style={styles.marginV}
            />
        </View>
    );

    const renderStep8 = () => {
        const traitList = [
            { id: 'Empathetic', desc: 'Validate feelings first; mirror user emotion.', icon: 'heart-outline', color: '#FFEBF2' },
            { id: 'Supportive', desc: 'Offer encouragement and small, actionable steps.', icon: 'shield-checkmark-outline', color: '#EBF5FF' },
            { id: 'Warm', desc: 'Use friendly, inviting phrasing and gentle tone.', icon: 'sunny-outline', color: '#FFF4EB' },
            { id: 'Patient', desc: 'Avoid rushing; offer repeats/explanations calmly.', icon: 'time-outline', color: '#F0F0F0' },
            { id: 'Encouraging', desc: 'Highlight strengths and motivate next moves.', icon: 'trending-up-outline', color: '#E7F9EF' },
            { id: 'Dependable', desc: 'State what you will do and confirm follow-through.', icon: 'anchor-outline', color: '#F5EFFF' },
            { id: 'Clear', desc: 'Give simple, step-by-step suggestions when asked.', icon: 'list-outline', color: '#E7F9F7' },
            { id: 'Resourceful', desc: 'Propose practical options and quick hacks.', icon: 'bulb-outline', color: '#FFFBE6' },
            { id: 'Respectful', desc: 'Honor boundaries and avoid pushing.', icon: 'hand-left-outline', color: '#F0F0F0' },
            { id: 'Playful', desc: 'Sprinkle light levity only when appropriate.', icon: 'happy-outline', color: '#FFF0F0' },
        ];

        return (
            <View style={styles.stepContainer}>
                <View style={[styles.iconCircleHeader, { backgroundColor: '#F922FF08' }]}>
                    <Ionicons name="color-palette-outline" size={40} color="#F922FF" />
                </View>

                <Text style={styles.megaTitle}>Character</Text>
                <Text style={styles.subtitle}>Define their core personality and voice.</Text>

                <Text style={styles.inputLabel}>Choose & Scale Traits</Text>

                {traitList.map(trait => (
                    <PickerCard
                        key={trait.id}
                        title={trait.id}
                        description={trait.desc}
                        icon={trait.icon as any}
                        iconBgColor={trait.color}
                        selected={!!personality[trait.id]}
                        onSelect={() => {
                            if (personality[trait.id]) {
                                const newP = { ...personality };
                                delete newP[trait.id];
                                setPersonality(newP);
                            } else {
                                setPersonality({ ...personality, [trait.id]: 3 });
                            }
                        }}
                    >
                        <View style={styles.sliderContainer}>
                            <Text style={styles.pointsLabel}>Intensity: {personality[trait.id] || 0}/5</Text>
                            <View style={styles.pointsRow}>
                                <View style={styles.pointTrack} />
                                {[1, 2, 3, 4, 5].map(p => (
                                    <TouchableOpacity
                                        key={p}
                                        style={styles.pointTouch}
                                        onPress={() => setPersonality({ ...personality, [trait.id]: p })}
                                    >
                                        <View style={[styles.pointDot, personality[trait.id] === p && styles.pointDotActive]} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </PickerCard>
                ))}

                <Text style={[styles.inputLabel, { marginTop: 32 }]}>AI Voice</Text>
                <View style={styles.voiceList}>
                    {[
                        { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', icon: 'woman-outline' },
                        { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', icon: 'man-outline' },
                        { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', icon: 'person-outline' },
                        { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', icon: 'rose-outline' }
                    ].map(voice => (
                        <View key={voice.id} style={[styles.voiceItem, voiceId === voice.id && styles.voiceItemSelected]}>
                            <TouchableOpacity
                                style={styles.voiceSelectArea}
                                onPress={() => setVoiceId(voice.id)}
                            >
                                <Ionicons name={voice.icon as any} size={20} color={voiceId === voice.id ? "#F922FF" : "#3062C8"} />
                                <Text style={[styles.voiceName, voiceId === voice.id && styles.voiceNameActive]}>{voice.name}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={async () => {
                                    setPreviewing(voice.id);
                                    // await speakReply(`Hi, I'm ${voice.name}. I can be your Soul Kindred.`, voice.id);
                                    console.log("Speak Reply disabled for debugging");
                                    setPreviewing(null);
                                }}
                                style={styles.previewBtn}
                            >
                                {previewing === voice.id ? (
                                    <ActivityIndicator size="small" color="#F922FF" />
                                ) : (
                                    <Ionicons name="play-circle-outline" size={24} color="#F922FF" />
                                )}
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                <AuthButton
                    label="Continue"
                    onPress={handleContinue}
                    style={styles.marginV}
                />
            </View>
        );
    };

    const renderStep9 = () => (
        <View style={styles.premiumContainer}>
            <View style={styles.premiumAvatarContainer}>
                <Image
                    source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarId}` }}
                    style={styles.premiumAvatar}
                />
                <View style={styles.premiumCrownBadge}>
                    <Ionicons name="ribbon" size={20} color="#fff" />
                </View>
            </View>

            <Text style={styles.deepenTitle}>Deepen Your Bond</Text>
            <Text style={styles.deepenDesc}>
                Unlock unlimited conversations, emotional memory, and exclusive scenes.
            </Text>

            <View style={styles.toggleWrapper}>
                <TouchableOpacity
                    style={[styles.toggleBtn, billingCycle === 'monthly' && styles.toggleBtnActive]}
                    onPress={() => setBillingCycle('monthly')}
                >
                    <Text style={[styles.toggleLabel, billingCycle === 'monthly' && styles.toggleLabelActive]}>Monthly</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleBtn, billingCycle === 'annually' && styles.toggleBtnActive]}
                    onPress={() => setBillingCycle('annually')}
                >
                    <Text style={[styles.toggleLabel, billingCycle === 'annually' && styles.toggleLabelActive]}>Annually</Text>
                    <View style={styles.discountPill}>
                        <Text style={styles.discountText}>-35%</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.premiumCard}
                onPress={() => setPlanId('premium')}
            >
                <View style={styles.premiumCardHeader}>
                    <View>
                        <Text style={[styles.megaTitle, { marginVertical: 0, fontSize: 32 }]}>Premium</Text>
                        <View style={styles.premiumBadge}>
                            <Text style={styles.premiumBadgeText}>FULL EXPERIENCE</Text>
                        </View>
                    </View>
                    <View style={styles.priceLabel}>
                        <Text style={styles.priceMain}>$12.99</Text>
                        <Text style={styles.priceSub}>per month</Text>
                    </View>
                </View>

                <LinearGradient
                    colors={['rgba(94, 213, 255, 0.05)', 'rgba(94, 213, 255, 0.3)', 'rgba(249, 34, 255, 0.5)', '#F922FF']}
                    style={styles.premiumFeatures}
                >
                    {[
                        'Unlimited Voice & Text Chat',
                        'Advanced Memory (Remembers everything)',
                        'Unlock All 12 Scenes',
                        'Deep Emotional Analytics',
                        'Smart Voice Cloning'
                    ].map((feature, i) => (
                        <View key={i} style={styles.featureRow}>
                            <View style={styles.featureCheckActive}>
                                <Ionicons name="checkmark" size={16} color="#24D18B" />
                            </View>
                            <Text style={styles.featureText}>{feature}</Text>
                        </View>
                    ))}
                    <View style={{ alignItems: 'flex-end', marginTop: 10 }}>
                        <View style={[styles.radioCircle, planId === 'premium' && styles.radioCircleActive]}>
                            {planId === 'premium' && <View style={styles.radioInner} />}
                        </View>
                    </View>
                </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.freemiumCard}
                onPress={() => setPlanId('free')}
            >
                <View>
                    <Text style={styles.freemiumTitle}>Freemium</Text>
                    <Text style={styles.freemiumSub}>Basic Access</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Text style={[styles.priceMain, { fontSize: 24 }]}>$0</Text>
                    <View style={[styles.radioCircle, planId === 'free' && styles.radioCircleActive]}>
                        {planId === 'free' && <View style={styles.radioInner} />}
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.trialButton}
                onPress={handleFinalSignup}
            >
                <LinearGradient
                    colors={['#F922FF', '#9D50BB']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.trialButtonGradient}
                >
                    <Text style={styles.trialButtonText}>Start 7-Day Free Trial</Text>
                    <Ionicons name="arrow-forward" size={24} color="#fff" />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    const getStepLabel = () => {
        if (step === 9) return 'UNLOCK FULL ACCESS';
        const labels: Record<number, string> = {
            1: 'Create Account',
            2: 'Verification',
            3: 'Set Password',
            4: 'Companion Type',
            5: 'Your Age',
            6: 'Primary Language',
            7: 'AI Basics',
            8: 'Character',
            9: 'Subscription'
        };
        return labels[step] || 'Signup';
    };

    const onBack = () => step > 1 ? setStep((step - 1) as SignupStep) : router.back();

    if (showSuccess) {
        return <SafeAreaView style={styles.container}>{renderSuccess()}</SafeAreaView>;
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <AuthHeader
                    step={step}
                    totalSteps={9}
                    stepLabel={getStepLabel()}
                    onBack={onBack}
                />
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}
                    {step === 5 && renderStep5()}
                    {step === 6 && renderStep6()}
                    {step === 7 && renderStep7()}
                    {step === 8 && renderStep8()}
                    {step === 9 && renderStep9()}
                </ScrollView>
            </KeyboardAvoidingView>
            {isSigningUp && (
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(11, 18, 32, 0.9)', zIndex: 999, alignItems: 'center', justifyContent: 'center' }]}>
                    <SoulLoader size={200} />
                    <Text style={{ color: '#fff', fontSize: 18, marginTop: -20, fontWeight: '700' }}>Creating your Soul Kindred...</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    stepContainer: {
        alignItems: 'center',
        width: '100%',
    },
    avatarContainer: {
        marginTop: 20,
        marginBottom: 32,
    },
    avatarGlow: {
        width: 120,
        height: 120,
        borderRadius: 60,
        padding: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInner: {
        width: 114,
        height: 114,
        borderRadius: 57,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#000',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(0,0,0,0.5)',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
    },
    inputGroup: {
        width: '100%',
        marginBottom: 24,
    },
    inputUnderline: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        fontSize: 18,
        paddingVertical: 12,
        color: '#000',
    },
    hintContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 4,
    },
    hintText: {
        fontSize: 12,
        fontStyle: 'italic',
        color: 'rgba(0,0,0,0.4)',
    },
    errorText: {
        color: '#ff4d4d',
        textAlign: 'center',
        marginVertical: 8,
    },
    marginV: {
        marginVertical: 24,
    },
    marginB: {
        marginBottom: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: 'rgba(0,0,0,0.4)',
        fontSize: 16,
    },
    linkText: {
        color: '#4CC9F0',
        fontWeight: 'bold',
        fontSize: 16,
    },
    legalContainer: {
        marginTop: 48,
        alignItems: 'center',
    },
    legalText: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.3)',
        marginBottom: 2,
    },
    legalLink: {
        fontSize: 14,
        color: '#3062C8',
        fontWeight: '600',
        textDecorationLine: 'underline',
        marginBottom: 2,
    },
    // Step 2 & 3 Styles
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F5F5FA',
        marginTop: 20,
        marginBottom: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gradientBox: {
        width: 40,
        height: 40,
    },
    changeEmailText: {
        color: '#4CC9F0',
        fontWeight: '600',
        marginBottom: 40,
    },
    otpContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 40,
    },
    otpBox: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        backgroundColor: 'rgba(249, 34, 255, 0.03)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    otpBoxActive: {
        borderColor: '#F922FF',
        borderWidth: 2,
    },
    otpDigit: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    resendText: {
        color: 'rgba(0,0,0,0.3)',
        fontSize: 14,
        marginBottom: 8,
    },
    keypadDummy: {
        marginTop: 20,
        width: '100%',
        padding: 20,
        alignItems: 'center',
    },
    dummyText: {
        color: 'rgba(0,0,0,0.1)',
        fontSize: 16,
    },
    // Step 4+ Styles
    iconCircleHeader: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F5F5FA',
        marginTop: 10,
        marginBottom: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    megaTitle: {
        fontSize: 36,
        lineHeight: 42,
        fontWeight: '900',
        color: '#000',
        textAlign: 'center',
        marginBottom: 16,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 16,
    },
    infoText: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.3)',
        fontWeight: '600',
    },
    avatarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        gap: 16,
        marginTop: 20,
    },
    avatarOption: {
        width: (width - 64) / 2,
        aspectRatio: 1,
        backgroundColor: '#F5F5FA',
        borderRadius: 24,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    avatarOptionSelected: {
        borderColor: '#F922FF',
        backgroundColor: 'rgba(249, 34, 255, 0.05)',
    },
    avatarPreview: {
        width: '80%',
        height: '80%',
        borderRadius: 20,
    },
    avatarLabel: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '700',
        color: '#3062C8',
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '800',
        color: '#000',
        marginBottom: 12,
        alignSelf: 'flex-start',
    },
    pickerRow: {
        flexDirection: 'row',
        gap: 10,
    },
    chip: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#F5F5FA',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    chipActive: {
        backgroundColor: '#24D18B',
        borderColor: '#24D18B',
    },
    chipText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(0,0,0,0.4)',
    },
    chipTextActive: {
        color: '#fff',
    },
    personalityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    traitBtn: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    traitBtnActive: {
        backgroundColor: '#3062C8',
        borderColor: '#3062C8',
    },
    traitText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#3062C8',
    },
    traitTextActive: {
        color: '#fff',
    },
    themeScroll: {
        width: '100%',
        marginHorizontal: -24,
        paddingHorizontal: 24,
    },
    themeCard: {
        width: 160,
        height: 200,
        marginRight: 16,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: 'transparent',
    },
    themeCardSelected: {
        borderColor: '#5ED5FF',
    },
    themeImg: {
        width: '100%',
        height: '100%',
    },
    themeOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    themeName: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 14,
    },
    planContainer: {
        width: '100%',
        gap: 16,
    },
    planBox: {
        width: '100%',
        height: 100,
        borderRadius: 24,
        backgroundColor: '#F5F5FA',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    planBoxActive: {
        borderColor: '#F922FF',
        borderWidth: 2,
    },
    planPremiumBg: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    planTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#3062C8',
    },
    planPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: 'rgba(0,0,0,0.4)',
        marginTop: 2,
    },
    footerLock: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 24,
    },
    footerLockText: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.3)',
        textAlign: 'center',
    },
    requestLanguage: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    requestPrefix: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.3)',
    },
    requestLink: {
        fontSize: 14,
        color: '#4CC9F0',
        fontWeight: '700',
    },
    planDesc: {
        fontSize: 12,
        marginTop: 4,
    },
    // Points Slider Styles
    sliderContainer: {
        marginTop: 12,
        width: '100%',
    },
    pointsLabel: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.3)',
        fontWeight: '700',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    pointsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    pointTrack: {
        position: 'absolute',
        top: '50%',
        left: 20,
        right: 20,
        height: 2,
        backgroundColor: 'rgba(0,0,0,0.05)',
        marginTop: -1,
    },
    pointTouch: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pointDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#EBF5FF',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    pointDotActive: {
        backgroundColor: '#F922FF',
        width: 14,
        height: 14,
        borderRadius: 7,
        shadowColor: '#F922FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    // Subscription Screen Styles (High Fidelity)
    premiumContainer: {
        alignItems: 'center',
        width: '100%',
        paddingBottom: 40,
    },
    premiumAvatarContainer: {
        marginBottom: 24,
        position: 'relative',
    },
    premiumAvatar: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 4,
        borderColor: '#5ED5FF20',
    },
    premiumCrownBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFD700',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    deepenTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 12,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    deepenDesc: {
        fontSize: 15,
        color: 'rgba(0,0,0,0.5)',
        textAlign: 'center',
        lineHeight: 22,
        marginHorizontal: 10,
        marginBottom: 32,
    },
    toggleWrapper: {
        flexDirection: 'row',
        backgroundColor: '#F5F5FA',
        borderRadius: 30,
        padding: 5,
        marginBottom: 32,
        width: '100%',
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,
        flexDirection: 'row',
        gap: 8,
    },
    toggleBtnActive: {
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    toggleLabel: {
        fontSize: 14,
        fontWeight: '800',
        color: 'rgba(0,0,0,0.3)',
    },
    toggleLabelActive: {
        color: '#1a1a1a',
    },
    discountPill: {
        backgroundColor: '#24D18B',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
    },
    discountText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
    },
    premiumCard: {
        width: '100%',
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        marginBottom: 20,
        elevation: 8,
        shadowColor: '#F922FF',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
    },
    premiumCardHeader: {
        padding: 24,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    premiumBadge: {
        backgroundColor: '#F5EFFB',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 6,
    },
    premiumBadgeText: {
        color: '#3062C8',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    priceLabel: {
        alignItems: 'flex-end',
    },
    priceMain: {
        fontSize: 28,
        fontWeight: '900',
        color: '#1a1a1a',
    },
    priceSub: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.4)',
        fontWeight: '600',
    },
    premiumFeatures: {
        padding: 24,
        paddingTop: 0,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    featureText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1a1a1a',
        flex: 1,
    },
    featureCheckActive: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(36, 209, 139, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureCheckSelected: {
        backgroundColor: '#24D18B10',
    },
    radioCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioCircleActive: {
        borderColor: '#F922FF',
    },
    radioInner: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#F922FF',
    },
    freemiumCard: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 32,
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        marginBottom: 32,
    },
    freemiumTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1a1a1a',
        fontStyle: 'italic',
    },
    freemiumSub: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.4)',
        fontWeight: '600',
        marginTop: 2,
    },
    trialButton: {
        width: '100%',
        height: 64,
        borderRadius: 32,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#F922FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    trialButtonGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    trialButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '900',
    },
    // Success Screen Styles
    successContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    successCrown: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F5EFFB',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    successTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#1a1a1a',
        textAlign: 'center',
        marginBottom: 16,
    },
    successSubtitle: {
        fontSize: 16,
        color: 'rgba(0,0,0,0.5)',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    vipBadge: {
        fontSize: 18,
        fontWeight: '900',
        color: '#3062C8',
        marginBottom: 24,
    },
    voiceList: {
        width: '100%',
        gap: 12,
        marginTop: 16,
    },
    voiceItem: {
        width: '100%',
        backgroundColor: '#F8FAFF',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'rgba(48, 98, 200, 0.05)',
    },
    voiceItemSelected: {
        backgroundColor: '#F922FF08',
        borderColor: '#F922FF20',
    },
    voiceSelectArea: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    voiceName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#3062C8',
    },
    voiceNameActive: {
        color: '#F922FF',
    },
    previewBtn: {
        padding: 4,
    },
});
