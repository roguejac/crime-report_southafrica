from collections import Counter
from fastapi import FastAPI
from datetime import datetime
from pydantic import BaseModel
import csv
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

db = {
    "reports": [],
    "users": 0
}

class CrimeReport(BaseModel):
    area: str
    time_of_day: str
    day_type: str
    description: str

@app.get("/")
def read_root():
    return {"status": "Crime API running"}

@app.post("/report")
def report_crime(data: CrimeReport):
    db["reports"].append(data.dict())
    return {"message": "Report received"}

@app.get("/predict")
def predict(area: str = "", time_of_day: str = ""):
    # Dummy prediction
    return {"prediction": "High Risk" if time_of_day == "night" else "Moderate Risk"}

@app.get("/admin-stats")
def get_admin_stats():
    # Paths to the CSVs
    user_log_path = "data/user_log.csv"
    prediction_log_path = "data/predictions.csv"
    crime_log_path = "data/crime_reports.csv"

    # Counts
    total_users = 0
    predictions_made = 0
    total_crime_reports = 0
    prediction_trends = []

    # Count users
    if os.path.exists(user_log_path):
        with open(user_log_path, newline='') as f:
            total_users = sum(1 for row in csv.reader(f)) - 1  # Subtract header

    # Count predictions and trends
    date_counts = Counter()
    if os.path.exists(prediction_log_path):
        with open(prediction_log_path, newline='') as f:
            reader = csv.DictReader(f)
            for row in reader:
                predictions_made += 1
                date_str = row.get("timestamp", "").split("T")[0]
                if date_str:
                    date_counts[date_str] += 1

    prediction_trends = [{"date": d, "count": date_counts[d]} for d in sorted(date_counts)]

    # Count reported crimes
    if os.path.exists(crime_log_path):
        with open(crime_log_path, newline='') as f:
            total_crime_reports = sum(1 for row in csv.reader(f)) - 1  # Subtract header

    return {
        "total_users": total_users,
        "predictions_made": predictions_made,
        "total_crime_reports": total_crime_reports,
        "prediction_trends": prediction_trends
    }


@app.middleware("http")
async def count_users(request: Request, call_next):
    if request.url.path == "/":
        db["users"] += 1
    response = await call_next(request)
    return response
