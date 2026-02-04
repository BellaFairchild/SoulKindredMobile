import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber/native';
import { useAppStore } from '@/state/store';
import { useOverlay } from '@/context/OverlayContext';
import * as THREE from 'three';

export function Lunchbox3D(props: any) {
    const mesh = useRef<THREE.Mesh>(null!);
    const isDropAvailable = useAppStore(state => state.isDropAvailable);
    const claimDailyDrop = useAppStore(state => state.claimDailyDrop);
    const { showOverlay } = useOverlay();
    const [hovered, setHover] = useState(false);

    useFrame((state, delta) => {
        if (isDropAvailable && mesh.current) {
            // Gentle floating animation when available
            mesh.current.position.y = -0.8 + Math.sin(state.clock.elapsedTime) * 0.05;
            mesh.current.rotation.y += delta * 0.5;
        }
    });

    const handlePress = () => {
        if (isDropAvailable) {
            claimDailyDrop(); // This adds to vault
            showOverlay('daily_drop'); // This shows UI
        }
    };

    if (!isDropAvailable) return null; // Hide box if already claimed

    return (
        <mesh
            {...props}
            ref={mesh}
            scale={hovered ? 1.1 : 1}
            onClick={handlePress}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <boxGeometry args={[0.4, 0.3, 0.4]} />
            <meshBasicMaterial color={hovered ? 'hotpink' : '#F59E0B'} />
        </mesh>
    );
}
