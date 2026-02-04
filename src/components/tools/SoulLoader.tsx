import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import LottieView from 'lottie-react-native';

interface SoulLoaderProps {
    size?: number;
}

export default function SoulLoader({ size = 150 }: SoulLoaderProps) {
    return (
        <View style={styles.container}>
            <LottieView
                source={require('../../../assets/loading.json')}
                autoPlay
                loop
                style={{ width: size, height: size }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
