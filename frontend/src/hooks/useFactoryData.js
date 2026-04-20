import { useEffect, useState } from "react";
import { initialMachines } from "../data/mockData";

export default function useFactoryData() {
  const [machines, setMachines] = useState(initialMachines);

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = machines.map((m) => {
        const temp = m.temp + (Math.random() * 4 - 2);
        const vibration = m.vibration + (Math.random() * 0.1 - 0.05);

        let status = "RUNNING";

        if (temp > 90 || vibration > 0.8) status = "FAIL";
        else if (temp > 80 || vibration > 0.5) status = "WARNING";

        return { ...m, temp, vibration, status };
      });

      setMachines(updated);
    }, 2000);

    return () => clearInterval(interval);
  }, [machines]);

  return machines;
}