from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import datetime

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
def admin_stats():
    from collections import Counter
    area_count = Counter([r["area"] for r in db["reports"]])
    daily = Counter([datetime.datetime.now().strftime("%Y-%m-%d")])
    return {
        "totalUsers": db["users"],
        "totalReports": len(db["reports"]),
        "reportsByArea": [{"area": k, "count": v} for k, v in area_count.items()],
        "submissionsOverTime": [{"date": k, "count": v} for k, v in daily.items()]
    }

@app.middleware("http")
async def count_users(request: Request, call_next):
    if request.url.path == "/":
        db["users"] += 1
    response = await call_next(request)
    return response