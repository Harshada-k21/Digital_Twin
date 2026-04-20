import streamlit as st
import numpy as np
import pandas as pd
import plotly.graph_objs as go
from model import train_model

st.title("🏭 Digital Twin - Predictive Maintenance System")

# -------------------------
# LOAD DATASET
# -------------------------
df = pd.read_csv("data/archive.csv")

# OPTIONAL: check columns (debug)
# st.write(df.columns)

# -------------------------
# FIX COLUMN MAPPING (IMPORTANT)
# -------------------------
# If your Kaggle dataset uses different names, adjust here:
df.rename(columns={
    "temperature": "temp",
    "vibration_level": "vibration",
    "machine_load": "load"
}, inplace=True)

# -------------------------
# LOAD MODEL (cached)
# -------------------------
model = train_model()

# -------------------------
# PREDICTION
# -------------------------
df["prediction"] = model.predict(df[["temp", "vibration", "load"]])

# -------------------------
# STATUS
# -------------------------
latest = df.iloc[-1]

if latest["prediction"] == 1:
    st.error("⚠ MACHINE FAILURE RISK DETECTED")
else:
    st.success("✅ MACHINE RUNNING NORMALLY")

# -------------------------
# KPI METRICS
# -------------------------
st.subheader("Key Parameters")

col1, col2, col3 = st.columns(3)
col1.metric("Temperature", f"{latest['temp']:.2f}")
col2.metric("Vibration", f"{latest['vibration']:.2f}")
col3.metric("Load", f"{latest['load']:.2f}")

# -------------------------
# GRAPH
# -------------------------
fig = go.Figure()
fig.add_trace(go.Scatter(y=df["temp"], name="Temperature"))
fig.add_trace(go.Scatter(y=df["vibration"], name="Vibration"))

st.plotly_chart(fig)

# -------------------------
# FAILURE TREND
# -------------------------
st.subheader("Failure Prediction Trend")
st.line_chart(df["prediction"])