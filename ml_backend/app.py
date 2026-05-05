"""
app.py — EduTrack ML Prediction API
Endpoints:
  POST /api/predict          → full prediction for one student
  POST /api/predict/batch    → predictions for multiple students (faculty view)
  GET  /api/model/info       → model metadata, feature importances
  GET  /api/health           → health check
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib, json, numpy as np, os

app = Flask(__name__)
CORS(app)   # allow React dev server on any port

# ── Load models ───────────────────────────────────────────────────────────────
BASE = os.path.dirname(__file__)
MODEL_DIR = os.path.join(BASE, "models")

reg        = joblib.load(os.path.join(MODEL_DIR, "score_regressor.pkl"))
clf_grade  = joblib.load(os.path.join(MODEL_DIR, "grade_classifier.pkl"))
clf_risk   = joblib.load(os.path.join(MODEL_DIR, "risk_classifier.pkl"))
le_grade   = joblib.load(os.path.join(MODEL_DIR, "label_encoder_grade.pkl"))
le_risk    = joblib.load(os.path.join(MODEL_DIR, "label_encoder_risk.pkl"))

with open(os.path.join(MODEL_DIR, "meta.json")) as f:
    META = json.load(f)

FEATURES = META["features"]

# ── Helpers ───────────────────────────────────────────────────────────────────
def build_feature_vector(data: dict) -> np.ndarray:
    """Extract and validate features from request payload."""
    vec = []
    for feat in FEATURES:
        val = data.get(feat)
        if val is None:
            raise ValueError(f"Missing feature: {feat}")
        vec.append(float(val))
    return np.array(vec).reshape(1, -1)


def predict_one(data: dict) -> dict:
    X = build_feature_vector(data)

    # Score prediction
    predicted_score = float(reg.predict(X)[0])
    predicted_score = round(min(max(predicted_score, 0), 100), 2)

    # Grade prediction with probabilities
    grade_probs  = clf_grade.predict_proba(X)[0]
    grade_idx    = int(np.argmax(grade_probs))
    predicted_grade = le_grade.classes_[grade_idx]
    grade_confidence = round(float(grade_probs[grade_idx]) * 100, 1)

    # Risk prediction with probabilities
    risk_probs   = clf_risk.predict_proba(X)[0]
    risk_idx     = int(np.argmax(risk_probs))
    predicted_risk = le_risk.classes_[risk_idx]
    risk_confidence = round(float(risk_probs[risk_idx]) * 100, 1)

    # All grade probabilities for distribution chart
    grade_distribution = {
        le_grade.classes_[i]: round(float(p) * 100, 1)
        for i, p in enumerate(grade_probs)
    }

    # Feature contribution (importance × normalised feature value)
    feat_imp = META["feature_importance"]
    feat_vals = dict(zip(FEATURES, X[0]))
    # Normalise each feature to 0-1 for contribution display
    norm_ranges = {
        "attendance_pct": 100, "gpa": 10, "internal_marks": 50,
        "assignments_completed_pct": 100, "study_hours_per_week": 14,
        "quiz_avg": 100, "prev_semester_score": 100,
    }
    contributing_factors = []
    for feat, imp in feat_imp.items():
        contributing_factors.append({
            "name": feat.replace("_", " ").title(),
            "value": round(imp, 1),
        })

    # Risk description
    risk_descriptions = {
        "Low Risk":    "Your current performance indicates low risk of academic difficulties. Keep up the good work!",
        "Medium Risk": "Your performance shows moderate risk. Focus on attendance and assignments to improve.",
        "High Risk":   "Your performance indicates high academic risk. Immediate attention and faculty support recommended.",
    }

    # Grade range (possible grades around prediction)
    grade_order = ["F", "C", "B", "B+", "A", "A+"]
    g_idx = grade_order.index(predicted_grade) if predicted_grade in grade_order else 3
    low_g  = grade_order[max(g_idx - 1, 0)]
    high_g = grade_order[min(g_idx + 1, len(grade_order) - 1)]

    return {
        "predicted_score":      predicted_score,
        "predicted_grade":      predicted_grade,
        "grade_confidence":     grade_confidence,
        "predicted_risk":       predicted_risk,
        "risk_confidence":      risk_confidence,
        "risk_description":     risk_descriptions[predicted_risk],
        "grade_range":          f"{low_g} to {high_g}",
        "grade_distribution":   grade_distribution,
        "contributing_factors": contributing_factors,
        "input_features":       feat_vals,
    }


# ── Routes ────────────────────────────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "EduTrack RF v1.0"})


@app.route("/api/model/info", methods=["GET"])
def model_info():
    return jsonify({
        "features":            FEATURES,
        "grade_classes":       list(le_grade.classes_),
        "risk_classes":        list(le_risk.classes_),
        "feature_importance":  META["feature_importance"],
        "training_metrics": {
            "score_mae":       META["score_mae"],
            "grade_accuracy":  META["grade_accuracy"],
            "risk_accuracy":   META["risk_accuracy"],
        }
    })


@app.route("/api/predict", methods=["POST"])
def predict():
    data = request.get_json(force=True)
    if not data:
        return jsonify({"error": "No JSON body provided"}), 400
    try:
        result = predict_one(data)
        return jsonify(result)
    except ValueError as e:
        return jsonify({"error": str(e)}), 422
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500


@app.route("/api/predict/batch", methods=["POST"])
def predict_batch():
    """Accept list of student objects and return predictions for each."""
    data = request.get_json(force=True)
    if not isinstance(data, list):
        return jsonify({"error": "Expected a JSON array of student objects"}), 400
    results = []
    for i, student in enumerate(data):
        try:
            pred = predict_one(student)
            results.append({"index": i, "student_id": student.get("student_id", i), **pred})
        except Exception as e:
            results.append({"index": i, "error": str(e)})
    return jsonify(results)


if __name__ == "__main__":
    print("EduTrack ML API running on http://localhost:5000")
    app.run(debug=True, port=5000)
