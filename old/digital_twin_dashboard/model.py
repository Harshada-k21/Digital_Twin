from sklearn.ensemble import RandomForestClassifier
import pandas as pd

def train_model():
    # Load same dataset used in app
    df = pd.read_csv("data/archive.csv")

    # Match column names
    df.rename(columns={
        "temperature": "temp",
        "vibration_level": "vibration",
        "machine_load": "load"
    }, inplace=True)

    X = df[["temp", "vibration", "load"]]
    y = df["failure"] if "failure" in df.columns else (df["temp"] > 80).astype(int)

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)

    return model