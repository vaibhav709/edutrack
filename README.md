# EduTrack — Student Progress Tracking & Performance Prediction System

## Quick Start

### 1. ML Backend (Terminal 1)
```bash
cd ml_backend
pip install -r requirements.txt
python train_model.py   # trains Random Forest, saves to models/
python app.py           # API on http://localhost:5000
```

### 2. React Frontend (Terminal 2)
```bash
npm install
npm run dev             # UI on http://localhost:5173
```

## Login
- **Student** → Student Dashboard + ML Prediction page
- **Faculty** → Faculty Dashboard + Student Management (batch ML)

## ML Features
- 7 input features: attendance, GPA, internal marks, assignments, study hours, quiz avg, prev score
- 3 outputs: predicted final score, letter grade (A+/A/B+/B/C/F), risk level (Low/Medium/High)
- Score MAE: 2.68 | Grade Accuracy: 74.8% | Risk Accuracy: 92.7%
- Graceful local fallback if API is offline
