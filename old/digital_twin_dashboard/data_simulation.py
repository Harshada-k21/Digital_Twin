import numpy as np
import pandas as pd

def generate_data(n=1000):
    time = np.arange(n)

    temperature = 50 + 0.03*time + np.random.normal(0, 2, n)
    vibration = 0.5 + 0.002*time + np.random.normal(0, 0.05, n)
    load = 70 + np.sin(time/50)*10 + np.random.normal(0, 1, n)

    failure = (temperature > 80) | (vibration > 1.2)

    df = pd.DataFrame({
        "temp": temperature,
        "vibration": vibration,
        "load": load,
        "failure": failure.astype(int)
    })

    return df