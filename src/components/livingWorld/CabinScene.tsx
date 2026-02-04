import React, { Suspense, useMemo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { useGLTF } from '@react-three/drei/native';
import { StyleSheet } from "react-native";
import * as THREE from 'three';

function CabinModel() {
  // Attempting the BIG file again, but with sanitation
  const { scene } = useGLTF(require('../../../assets/models/CabinScene.glb'));

  // "Geometry Extraction Mode": The Ultimate Sanitizer 🛡️
  const safeScene = useMemo(() => {
    const cleanGroup = new THREE.Group();
    const pinkClay = new THREE.MeshBasicMaterial({
      color: 0xffaaaa,
      side: THREE.DoubleSide
    });

    scene.traverse((obj: any) => {
      if (obj.isMesh && obj.geometry) {
        const newMesh = new THREE.Mesh(obj.geometry.clone(), pinkClay);

        newMesh.position.copy(obj.position);
        newMesh.rotation.copy(obj.rotation);
        newMesh.scale.copy(obj.scale);

        obj.updateMatrixWorld();
        newMesh.matrix.copy(obj.matrixWorld);
        newMesh.matrix.decompose(newMesh.position, newMesh.quaternion, newMesh.scale);

        cleanGroup.add(newMesh);
      }
    });

    cleanGroup.rotation.x = -Math.PI / 2;
    return cleanGroup;
  }, [scene]);

  return <primitive object={safeScene} scale={1} position={[0, -1, 0]} />;
}

export function CabinScene() {
  return (
    <View style={{ flex: 1 }}>
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 2, 5], fov: 45 }}
          gl={{ precision: 'lowp' }}
        >
          {/* No Lights needed for BasicMaterial */}
          <CabinModel />
        </Canvas>
      </Suspense>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
});
