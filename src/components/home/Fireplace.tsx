import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export function Fireplace() {
    const animation = useRef<LottieView>(null);

    useEffect(() => {
        // Auto-play the fire
        animation.current?.play();
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.shadowBase}
            />
            {/* 
               Using a placeholder Lottie URL for a cozy fire. 
               In production, download this JSON: https://lottiefiles.com/animations/fire-VjZ3J5qZ5q 
            */}
            <LottieView
                ref={animation}
                autoPlay
                loop
                style={styles.lottie}
                source={{ uri: 'https://lottie.host/5679d5df-d5b7-4489-9134-802513230536/PlaceholderFire.json' }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 200,
        zIndex: -1, // Behind UI, but could be in front of BG
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    shadowBase: {
        ...StyleSheet.absoluteFillObject,
        top: 50, // Fade start
    },
    lottie: {
        width: width,
        height: 300,
        opacity: 0.8,
    }
});
