import React from "react";

export default function Machine({ position, status }) {
  const color =
    status === "FAIL"
      ? "red"
      : status === "WARNING"
      ? "orange"
      : "green";

  return (
    <mesh position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}