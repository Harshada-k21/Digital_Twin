import React from "react";
import FactoryScene from "./components/FactoryScene";
import useFactoryData from "./hooks/useFactoryData";
import Dashboard from "./components/Dashboard";

export default function App() {
  const machines = useFactoryData();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 2 }}>
        <FactoryScene />
      </div>

      <div style={{ flex: 1, background: "#111" }}>
        <Dashboard machines={machines} />
      </div>
    </div>
  );
}