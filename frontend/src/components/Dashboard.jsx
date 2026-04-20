import React from "react";

export default function Dashboard({ machines }) {
  const total = machines.length;
  const fail = machines.filter((m) => m.status === "FAIL").length;
  const warn = machines.filter((m) => m.status === "WARNING").length;

  return (
    <div style={{ padding: 20, color: "white" }}>
      <h2>Factory KPIs</h2>

      <p>Total Machines: {total}</p>
      <p style={{ color: "orange" }}>Warning: {warn}</p>
      <p style={{ color: "red" }}>Failure: {fail}</p>
      <p style={{ color: "green" }}>Running: {total - warn - fail}</p>
    </div>
  );
}