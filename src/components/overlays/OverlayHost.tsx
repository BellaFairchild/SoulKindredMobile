import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Pressable, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { useOverlay } from '@/context/OverlayContext';
import { useTheme } from '@/context/AppTheme';
import { useAppStore } from '@/state/store';
import BreathOverlay from './BreathOverlay';
import TapOverlay from './TappingOverlay';
import BodyOverlay from './BodyOverlay';
import DailyDropOverlay from './DailyDropOverlay';
import BurnOverlay from './BurnOverlay';
import LevelUpOverlay from './LevelUpOverlay'; // Added LevelUpOverlay import

const { height } = Dimensions.get('window');

export default function OverlayHost() {
    const { activeOverlay, closeOverlay } = useOverlay();
    const { theme } = useTheme() as any;
    const isLight = theme.mode === "light";

    const anim = useRef(new Animated.Value(0)).current;

    // Gamification Listener
    const { showOverlay } = useOverlay();
    const level = useAppStore(state => state.level); // Listen to level changes
    const prevLevel = useRef(level);

    useEffect(() => {
        if (level > prevLevel.current) {
            // Level Up detected!
            showOverlay('levelup');
        }
        prevLevel.current = level;
    }, [level]);

    useEffect(() => {
        Animated.spring(anim, {
            toValue: activeOverlay ? 1 : 0,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
        }).start();
    }, [activeOverlay]);

    if (!activeOverlay) return null;

    const renderContent = () => {
        switch (activeOverlay) {
            case 'breath':
                return <BreathOverlay />;
            case 'tapping':
                return <TapOverlay />;
            case 'body':
                return <BodyOverlay />;
            case 'daily_drop':
                return <DailyDropOverlay />;
            case 'burn':
                return <BurnOverlay />;
            case 'levelup':
                return <LevelUpOverlay />;
            default:
                return null;
        }
    };

    const translateY = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [height, 0],
    });

    const opacity = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <Animated.View style={[styles.backdrop, { opacity }]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={closeOverlay} />
                <BlurView intensity={20} tint={isLight ? "light" : "dark"} style={StyleSheet.absoluteFill} />
            </Animated.View>

            <Animated.View style={[
                styles.sheet,
                {
                    transform: [{ translateY }],
                    backgroundColor: isLight ? '#FFFFFF' : '#0F172A',
                    borderColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
                }
            ]}>
                {/* Custom rendering for full screen overlays to bypass sheet style */}
                {(activeOverlay === 'tapping' || activeOverlay === 'body' || activeOverlay === 'levelup') ? (
                    <View style={StyleSheet.absoluteFill}>
                        {renderContent()}
                    </View>
                ) : (
                    <>
                        <View style={styles.handle} />
                        <View style={styles.content}>
                            {renderContent()}
                        </View>
                    </>
                )}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    sheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        // Borders are nice for sheets but maybe not for full screen immersives?
        // borderTopLeftRadius: 32,
        // borderTopRightRadius: 32,
        // borderWidth: 1,
        // paddingBottom: 40,
        minHeight: 350,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(0,0,0,0.1)',
        alignSelf: 'center',
        marginTop: 12,
    },
    content: {
        padding: 24,
    },
});
