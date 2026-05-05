# EduTrack ML Backend

Random Forest model for student grade & risk prediction.

## Setup

```bash
cd ml_backend
pip install -r requirements.txt

# Train the model (generates models/ folder)
python train_model.py

# Start the API server
python app.py
# → Running on http://localhost:5000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/model/info` | Model metadata & feature importances |
| POST | `/api/predict` | Predict for one student |
| POST | `/api/predict/batch` | Predict for multiple students |

## POST /api/predict — Request Body

```json
{
  "attendance_pct": 87.0,
  "gpa": 8.4,
  "internal_marks": 42.0,
  "assignments_completed_pct": 85.7,
  "study_hours_per_week": 5.0,
  "quiz_avg": 82.0,
  "prev_semester_score": 78.0
}
```

## Response

```json
{
  "predicted_score": 84.7,
  "predicted_grade": "A",
  "grade_confidence": 72.3,
  "predicted_risk": "Low Risk",
  "risk_confidence": 91.2,
  "risk_description": "Your current performance indicates low risk...",
  "grade_range": "B+ to A+",
  "grade_distribution": { "A+": 5.1, "A": 72.3, "B+": 18.4, "B": 3.2, "C": 1.0 },
  "contributing_factors": [
    { "name": "Attendance Pct", "value": 25.6 },
    ...
  ]
}
```

## Model Performance

| Metric | Value |
|--------|-------|
| Score MAE | 2.68 points |
| Grade Accuracy | 74.8% |
| Risk Accuracy | 92.7% |
| Training samples | 2,000 |
| Features | 7 academic indicators |

## Running the Full App

**Terminal 1 — ML API:**
```bash
cd ml_backend && python app.py
```

**Terminal 2 — React Frontend:**
```bash
npm install && npm run dev
```

The React app auto-connects to `http://localhost:5000`.
If the ML server is offline, it falls back to deterministic local calculation.
