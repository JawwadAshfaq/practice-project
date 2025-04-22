"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { inSphere } from "maath/random";
import * as THREE from "three";

const StarBackground = (props: any) => {
  const ref = useRef<THREE.Group | null>(null);
  const [sphere] = useState(() => inSphere(new Float32Array(4500), { radius: 1.2 }));

  // Twinkling effect: Adjust size and brightness
  useFrame(() => {
    if (ref.current) {
      // Create a subtle twinkling effect by adjusting brightness
      const time = Date.now() * 0.001;
      ref.current.children.forEach((child: any) => {
        child.material.color.setHSL(Math.sin(time + child.position.x) * 0.5 + 0.5, 1, 0.6);
        child.scale.set(1 + Math.sin(time + child.position.y) * 0.05, 1 + Math.cos(time + child.position.z) * 0.05, 1);
      });
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
        <StarBackground />
      </Canvas>
    </div>
  );
};

export default StarCanvas;
