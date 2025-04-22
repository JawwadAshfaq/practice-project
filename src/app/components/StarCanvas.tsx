"use client";

import React, { useState, useRef, Suspense, useEffect, useLayoutEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { inSphere } from "maath/random";
import * as THREE from "three";

const StarBackground = (props: any) => {
  const ref = useRef<THREE.Group | null>(null);
  const [sphere] = useState(() => inSphere(new Float32Array(4500), { radius: 1.2 }));

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group ref={ref} rotation={[0, 0, Math.PI / 4]}>
      <Points positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.002}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarCanvas = () => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    // Make sure the code runs only in the browser
    setIsBrowser(true);
  }, []);

  // Render the canvas only if it's in the browser environment
  if (!isBrowser) {
    return null;
  }

  return (
    <div
      className="w-full h-full fixed inset-0 z-[-1]"
      style={{ pointerEvents: "none" }}
    >
      <Canvas
        camera={{ position: [0, 0, 1] }}
        onPointerDown={(e) => e.stopPropagation()}
        onCreated={({ gl }) => {
          gl.domElement.style.pointerEvents = "none";
        }}
      >
        <Suspense fallback={null}>
          <StarBackground />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default StarCanvas;
