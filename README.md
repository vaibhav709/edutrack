# EduTrack — Student Progress Tracking & Performance Prediction System

## Quick Start

### 1. ML Backend (Terminal 1)
```bash
cd ml_backend
pip install -r requirements.txt
python train_model.py   # trains Random Forest, saves to models/
python app.py           
```

### 2. React Frontend (Terminal 2)
```bash
npm install
npm run dev         
```

## Login
- **Student** → Student Dashboard + ML Prediction page
- **Faculty** → Faculty Dashboard + Student Management (batch ML)

## ML Features
- 7 input features: attendance, GPA, internal marks, assignments, study hours, quiz avg, prev score
- 3 outputs: predicted final score, letter grade (A+/A/B+/B/C/F), risk level (Low/Medium/High)
- Score MAE: 2.68 | Grade Accuracy: 74.8% | Risk Accuracy: 92.7%
- Graceful local fallback if API is offline

THE PROJECT WAS DONE BY SHASHWAT MISHRA (RA2311027010120), VAIBHAV SHELKE (RA2311027010126), LUV ARORA (RA2311027010117)

<img width="1470" height="834" alt="Screenshot 2026-05-05 at 10 41 53 AM" src="https://github.com/user-attachments/assets/e0f11790-98b5-4aab-ae27-a722aefd4a79" />

<img width="1470" height="834" alt="Screenshot 2026-05-05 at 10 42 08 AM" src="https://github.com/user-attachments/assets/23282d87-ccaf-458a-94c8-95d949b2ef86" />

<img width="1470" height="833" alt="Screenshot 2026-05-05 at 10 42 49 AM" src="https://github.com/user-attachments/assets/017fbfd2-cc38-46d7-9f31-e6739158dc72" />

<img width="1470" height="844" alt="Screenshot 2026-05-05 at 10 43 12 AM" src="https://github.com/user-attachments/assets/232a8bb5-fe3f-479a-b763-33f0d8d7bea6" />

<img width="1470" height="835" alt="Screenshot 2026-05-05 at 10 44 21 AM" src="https://github.com/user-attachments/assets/d5ff6a61-06da-481f-a5eb-73a81ab4f00c" />

<img width="1470" height="838" alt="Screenshot 2026-05-05 at 10 44 34 AM" src="https://github.com/user-attachments/assets/4448c6f3-920f-4b98-91ce-85aed1462d6f" />

<img width="1470" height="835" alt="Screenshot 2026-05-05 at 10 44 47 AM" src="https://github.com/user-attachments/assets/8fd605c5-2e18-4435-b36a-313f42620636" />

