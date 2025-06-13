from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import pandas as pd
import os
import uuid
import json

app = FastAPI()

# Allow frontend to access backend (update in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use specific frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Paths
DATA_PATH = "data/crime_data.csv"
LOG_PATH = "data/usage_log.csv"

# Create folders/files if not exist
os.makedirs("data", exist_ok=True)
if not os.path.exists(DATA_PATH):
    pd.DataFrame(columns=[
        "timestamp", "area", "crime_type", "time_of_day", "day_of_week", "severity", "source", "lat", "lon"
    ]).to_csv(DATA_PATH, index=False)

if not os.path.exists(LOG_PATH):
    pd.DataFrame(columns=["user_id", "action", "timestamp"]).to_csv(LOG_PATH, index=False)

# ---------- DATA MODEL ---------- #
class CrimeReport(BaseModel):
    area: str
    crime_type: str
    time_of_day: str  # morning, afternoon, night
    day_of_week: str  # Monday, Tuesday, ...
    severity: int
    lat: float
    lon: float
    source: str = "user"

# ---------- ROUTES ---------- #
@app.get("/")
def root():
    return {"message": "Crime Dashboard Backend is Running ✅"}
@app.get("/dashboard")
def get_dashboard():
    print("🚀 /dashboard route was hit")

    # Example structure (mock data)
    return {
        "summary": {
            "total_reports": 1200,
            "most_common_crime": "Theft",
            "least_common_crime": "Kidnapping"
        },
        "top_areas": [
            {"area": "Johannesburg", "crime_count": 340},
            {"area": "Cape Town", "crime_count": 270}
        ],
        "time_series": [
            {"month": "2024-01", "reports": 123},
            {"month": "2024-02", "reports": 156},
        ]
    }
@app.get("/api/crime-data")
def get_crime_data():
    df = pd.read_csv(DATA_PATH)
    return df.to_dict(orient="records")

@app.post("/api/report-crime")
def report_crime(report: CrimeReport, request: Request):
    new_record = {
        "timestamp": datetime.now().isoformat(),
        "area": report.area,
        "crime_type": report.crime_type,
        "time_of_day": report.time_of_day,
        "day_of_week": report.day_of_week,
        "severity": report.severity,
        "lat": report.lat,
        "lon": report.lon,
        "source": report.source
    }
    df = pd.read_csv(DATA_PATH)
    df = pd.concat([df, pd.DataFrame([new_record])], ignore_index=True)
    df.to_csv(DATA_PATH, index=False)

    # Log the action
    user_id = request.headers.get("X-User-ID", str(uuid.uuid4()))
    log_action(user_id, "report_crime")
    
    return {"status": "success", "record": new_record}

@app.post("/api/log-action")
def log_user_action(request: Request):
    user_id = request.headers.get("X-User-ID", str(uuid.uuid4()))
    data = json.loads(request.body())
    action = data.get("action", "unknown")
    log_action(user_id, action)
    return {"status": "logged"}

def log_action(user_id: str, action: str):
    log_df = pd.read_csv(LOG_PATH)
    log_df = pd.concat([log_df, pd.DataFrame([{
        "user_id": user_id,
        "action": action,
        "timestamp": datetime.now().isoformat()
    }])])
    log_df.to_csv(LOG_PATH, index=False)
