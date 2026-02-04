import React, { Suspense, useMemo, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Canvas } from '@react-three/fiber/native';
import { useGLTF } from '@react-three/drei/native';
import * as THREE from 'three';
import { Lunchbox3D } from '@/components/home/Lunchbox3D';
import { usePatheticFallacy } from '@/hooks/usePatheticFallacy';
import { useCachedModel } from '@/hooks/useCachedModel';
import { Fireplace } from '@/components/home/Fireplace';
import LottieView from 'lottie-react-native';

// Basic Error Boundary for 3D Rendering
class ThreeErrorBoundary extends React.Component<{ children: React.ReactNode, onError: (e: any) => void }, { hasError: boolean }> {
    state = { hasError: false };
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error: any) { this.props.onError(error); }
    render() { return this.state.hasError ? <DebugCube /> : this.props.children; }
}

function DebugCube() {
    return (
        <mesh>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshBasicMaterial color="#5ED5FF" />
        </mesh>
    );
}

function RPMAvatar({ url }: { url: string }) {
    const { scene } = useGLTF(url);
    const isDuck = url.toLowerCase().includes('duck');

    // Optimization: Enable frustum culling for performance
    useMemo(() => {
        scene.traverse((obj: any) => {
            if (obj.isMesh) {
                obj.frustumCulled = true;
                obj.castShadow = true;
                obj.receiveShadow = true;
                // We keep original materials (Standard) -> No Override!
            }
        });
    }, [scene]);

    // RPM models usually need to be lowered slightly to fit frame
    // -0.9 was a bit too high (clipping head). Lowering to -1.2.
    const scale = isDuck ? 0.25 : 1;
    const yOffset = isDuck ? -0.5 : -1.2;

    return (
        <group>
            <group scale={scale} position={[0, yOffset, 0]}>
                <primitive object={scene} />
            </group>
        </group>
    );
}

export default function Companion3D({ glbUrl }: { glbUrl?: string }) {
    const environment = usePatheticFallacy();
    const { localUri, isLoading, error } = useCachedModel(glbUrl);
    const [retryCount, setRetryCount] = useState(0);

    // If error, show retry UI
    if (error) {
        return (
            <View style={[styles.container, styles.center]}>
                <Ionicons name="alert-circle" size={32} color="#EF4444" />
                <Text style={{ color: '#EF4444', marginTop: 10, textAlign: 'center' }}>{error}</Text>
                <TouchableOpacity onPress={() => setRetryCount(p => p + 1)} style={{ marginTop: 10, padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8 }}>
                    <Text style={{ color: '#fff' }}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Show loading ONLY if actually loading
    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#5ED5FF" />
                <Text style={{ color: '#94a3b8', marginTop: 10 }}>Syncing with Soul Kindred...</Text>
            </View>
        );
    }

    if (!glbUrl) return null;

    if (!localUri) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={{ color: '#64748b' }}>Waiting for avatar...</Text>
            </View>
        );
    }

    const isEmber = environment.weather === 'ember';
    const isRain = environment.weather === 'rain';

    return (
        <View style={styles.container}>
            {/* Background Atmosphere Tint */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: environment.primaryColor, opacity: 0.1 }]} pointerEvents="none" />

            {/* Weather Layers (2D Overlays) */}
            {isRain && (
                <LottieView
                    autoPlay
                    loop
                    source={{ uri: 'https://lottie.host/rain-placeholder.json' }}
                    style={[StyleSheet.absoluteFill, { opacity: 0.4 }]}
                    pointerEvents="none"
                />
            )}

            <Suspense fallback={
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#F922FF" />
                    <Text style={{ color: '#94a3b8', marginTop: 10 }}>Loading 3D Scene...</Text>
                </View>
            }>
                <Canvas
                    camera={{ position: [0, 1.3, 2.5], fov: 45 }} // Zoomed out slightly to fit head
                    gl={{ precision: 'highp' }}
                >
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
                    <pointLight position={[-5, 5, 5]} intensity={0.5} />

                    <Suspense fallback={null}>
                        <RPMAvatar url={localUri} />
                        {/* <Lunchbox3D position={[0.5, -0.8, 0.5]} /> */}
                    </Suspense>
                </Canvas>
            </Suspense>

            {/* Fireplace Foreground Layer */}
            {isEmber && <Fireplace />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 550, // Enlarged area as requested
        backgroundColor: 'transparent',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});
