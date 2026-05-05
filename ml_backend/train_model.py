"""
train_model.py
Generates a realistic synthetic student dataset and trains:
  - RandomForestRegressor  → predicted final score (0–100)
  - RandomForestClassifier → predicted letter grade (A+, A, B+, B, C, F)
  - RandomForestClassifier → risk level (Low Risk, Medium Risk, High Risk)

Features used (all match the EduTrack frontend data model):
  attendance_pct, gpa (0–10 scale), internal_marks (0–50),
  assignments_completed_pct, study_hours_per_week,
  quiz_avg, prev_semester_score
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, mean_absolute_error
import joblib, os, json

np.random.seed(42)
N = 2000   # training samples

def generate_dataset(n):
    attendance        = np.random.beta(7, 2, n) * 100          # skewed towards high
    gpa               = np.random.beta(5, 2, n) * 10           # 0-10 scale
    internal_marks    = np.random.normal(35, 7, n).clip(0, 50)
    assign_pct        = np.random.beta(6, 2, n) * 100
    study_hours       = np.random.normal(5, 2, n).clip(0, 14)
    quiz_avg          = np.random.normal(70, 12, n).clip(0, 100)
    prev_score        = np.random.normal(72, 12, n).clip(0, 100)

    # Composite final score with realistic weightings + noise
    final_score = (
        0.25 * attendance +
        0.20 * (gpa / 10 * 100) +
        0.20 * (internal_marks / 50 * 100) +
        0.15 * assign_pct +
        0.10 * quiz_avg +
        0.10 * prev_score
    ) + np.random.normal(0, 3, n)
    final_score = final_score.clip(0, 100)

    def score_to_grade(s):
        if s >= 90: return "A+"
        if s >= 80: return "A"
        if s >= 70: return "B+"
        if s >= 60: return "B"
        if s >= 50: return "C"
        return "F"

    def score_to_risk(s, att):
        if s < 55 or att < 60:  return "High Risk"
        if s < 70 or att < 75:  return "Medium Risk"
        return "Low Risk"

    grades = np.array([score_to_grade(s) for s in final_score])
    risks  = np.array([score_to_risk(s, a) for s, a in zip(final_score, attendance)])

    df = pd.DataFrame({
        "attendance_pct":          attendance,
        "gpa":                     gpa,
        "internal_marks":          internal_marks,
        "assignments_completed_pct": assign_pct,
        "study_hours_per_week":    study_hours,
        "quiz_avg":                quiz_avg,
        "prev_semester_score":     prev_score,
        "final_score":             final_score,
        "grade":                   grades,
        "risk_level":              risks,
    })
    return df

print("Generating dataset …")
df = generate_dataset(N)
print(df["grade"].value_counts())
print(df["risk_level"].value_counts())

FEATURES = [
    "attendance_pct", "gpa", "internal_marks",
    "assignments_completed_pct", "study_hours_per_week",
    "quiz_avg", "prev_semester_score"
]
X = df[FEATURES]

# ── Score regression ──────────────────────────────────────────────────────────
y_score = df["final_score"]
X_tr, X_te, y_tr, y_te = train_test_split(X, y_score, test_size=0.2, random_state=42)
reg = RandomForestRegressor(n_estimators=200, max_depth=12, random_state=42, n_jobs=-1)
reg.fit(X_tr, y_tr)
mae = mean_absolute_error(y_te, reg.predict(X_te))
print(f"Score MAE: {mae:.2f}")

# ── Grade classifier ──────────────────────────────────────────────────────────
le_grade = LabelEncoder()
y_grade = le_grade.fit_transform(df["grade"])
X_tr2, X_te2, y_tr2, y_te2 = train_test_split(X, y_grade, test_size=0.2, random_state=42)
clf_grade = RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42, n_jobs=-1)
clf_grade.fit(X_tr2, y_tr2)
acc = accuracy_score(y_te2, clf_grade.predict(X_te2))
print(f"Grade Accuracy: {acc:.3f}")

# ── Risk classifier ───────────────────────────────────────────────────────────
le_risk = LabelEncoder()
y_risk = le_risk.fit_transform(df["risk_level"])
X_tr3, X_te3, y_tr3, y_te3 = train_test_split(X, y_risk, test_size=0.2, random_state=42)
clf_risk = RandomForestClassifier(n_estimators=200, max_depth=12, random_state=42, n_jobs=-1)
clf_risk.fit(X_tr3, y_tr3)
acc2 = accuracy_score(y_te3, clf_risk.predict(X_te3))
print(f"Risk Accuracy:  {acc2:.3f}")

# ── Feature importance ────────────────────────────────────────────────────────
importances = reg.feature_importances_
feat_imp = {f: round(float(v)*100, 2) for f, v in zip(FEATURES, importances)}
feat_imp_sorted = dict(sorted(feat_imp.items(), key=lambda x: -x[1]))

# ── Save ──────────────────────────────────────────────────────────────────────
os.makedirs("models", exist_ok=True)
joblib.dump(reg,       "models/score_regressor.pkl")
joblib.dump(clf_grade, "models/grade_classifier.pkl")
joblib.dump(clf_risk,  "models/risk_classifier.pkl")
joblib.dump(le_grade,  "models/label_encoder_grade.pkl")
joblib.dump(le_risk,   "models/label_encoder_risk.pkl")

meta = {
    "features":        FEATURES,
    "grade_classes":   list(le_grade.classes_),
    "risk_classes":    list(le_risk.classes_),
    "feature_importance": feat_imp_sorted,
    "score_mae":       round(mae, 2),
    "grade_accuracy":  round(acc, 3),
    "risk_accuracy":   round(acc2, 3),
}
with open("models/meta.json", "w") as f:
    json.dump(meta, f, indent=2)

print("\nAll models saved to models/")
print(json.dumps(meta, indent=2))
