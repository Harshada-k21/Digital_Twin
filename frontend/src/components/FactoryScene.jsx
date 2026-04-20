import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import Machine from "./Machine";
import useFactoryData from "../hooks/useFactoryData";

export default function FactoryScene() {
  const machines = useFactoryData();

  return (
    <Canvas camera={{ position: [6, 6, 6] }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />

      <Grid args={[20, 20]} />

      {machines.map((m, index) => (
        <Machine
          key={m.id}
          position={[index * 2, 0, 0]}
          status={m.status}
        />
      ))}

      <OrbitControls />
    </Canvas>
  );
}