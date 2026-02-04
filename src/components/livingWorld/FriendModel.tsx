import React, { useMemo } from "react";
import { useGLTF } from "@react-three/drei/native";
import * as THREE from "three";
import { useCachedModel } from "@/hooks/useCachedModel";

export function FriendModel({ url }: { url: string }) {
  const { localUri, isLoading } = useCachedModel(url);

  if (!localUri || isLoading) return null;

  return <ActualModel url={localUri} />;
}

// function ActualModel({ url }: { url: string }) {
//   const { scene } = useGLTF(url);
//   const isDuck = url.toLowerCase().includes('duck');

//   const safeScene = useMemo(() => {
//     const clone = scene.clone(true);
//     clone.traverse((obj: any) => {
//       if (obj.isMesh) {
//         // Safe Mode: No Textures, No Translucency. Just Warm Clay.
//         obj.material = new THREE.MeshBasicMaterial({
//           color: 0xe0ac69,
//           skinning: false,
//         });
//       }
//     });
//     return clone;
//   }, [scene]);

//   return (
//     // <primitive
//     //   object={safeScene}
//     //   position={[0, isDuck ? 0.4 : -1.6, 0]} // Lowered to center face
//     //   rotation={[0, 0, 0]}
//     //   scale={isDuck ? 0.2 : 1.1}
//     // />
//     <mesh>
//       <boxGeometry args={[1, 1, 1]} />
//       <meshBasicMaterial color="red" />
//     </mesh>
//   );
// }

// Pure Red Box Component
function ActualModel({ url }: { url: string }) {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="red" />
    </mesh>
  );
}

