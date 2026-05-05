/**
 * mlService.js
 * Calls the EduTrack Flask ML backend.
 * Falls back to deterministic local calculation if the server is unreachable.
 */

const API_BASE = import.meta.env.VITE_ML_API_URL || "http://localhost:5000";

/**
 * Build the feature payload from a student's data (matches mockData structure).
 * @param {object} studentData    - from mockData.studentData
 * @param {object[]} subjects     - from mockData.subjects
 * @param {object[]} weeklyStudy  - from mockData.weeklyStudy
 */
export function buildPayload(studentData, subjects, weeklyStudy) {
  const avgInternal = subjects.reduce((s, c) => s + c.internal, 0) / subjects.length;
  const avgAttendance = subjects.reduce((s, c) => s + c.attendance, 0) / subjects.length;
  const totalStudyHours = weeklyStudy.reduce((s, d) => s + d.hours, 0) / weeklyStudy.length;
  const assignPct = (studentData.assignmentsCompleted / studentData.assignmentsTotal) * 100;

  return {
    attendance_pct:              Math.round(avgAttendance * 10) / 10,
    gpa:                         studentData.gpa,
    internal_marks:              Math.round(avgInternal * 10) / 10,
    assignments_completed_pct:   Math.round(assignPct * 10) / 10,
    study_hours_per_week:        Math.round(totalStudyHours * 10) / 10,
    quiz_avg:                    Math.round(studentData.gpa * 10),   // proxy: gpa*10
    prev_semester_score:         Math.round((studentData.gpa - 0.5) * 9 + 40), // proxy
  };
}

/**
 * Build per-subject feature payload.
 */
export function buildSubjectPayload(subject, studentData, weeklyStudy) {
  const totalStudyHours = weeklyStudy.reduce((s, d) => s + d.hours, 0) / weeklyStudy.length;
  return {
    attendance_pct:              subject.attendance,
    gpa:                         studentData.gpa,
    internal_marks:              subject.internal,
    assignments_completed_pct:   (studentData.assignmentsCompleted / studentData.assignmentsTotal) * 100,
    study_hours_per_week:        totalStudyHours,
    quiz_avg:                    subject.exam * 0.9,  // proxy
    prev_semester_score:         subject.total / 1.5, // proxy
  };
}

/**
 * Local fallback — deterministic math, no network needed.
 */
function localPredict(payload) {
  const {
    attendance_pct, gpa, internal_marks,
    assignments_completed_pct, study_hours_per_week,
    quiz_avg, prev_semester_score,
  } = payload;

  const score = Math.min(100, Math.max(0,
    0.25 * attendance_pct +
    0.20 * (gpa / 10 * 100) +
    0.20 * (internal_marks / 50 * 100) +
    0.15 * assignments_completed_pct +
    0.10 * quiz_avg +
    0.10 * prev_semester_score
  ));

  const grade =
    score >= 90 ? "A+" :
    score >= 80 ? "A"  :
    score >= 70 ? "B+" :
    score >= 60 ? "B"  :
    score >= 50 ? "C"  : "F";

  const risk =
    score < 55 || attendance_pct < 60 ? "High Risk" :
    score < 70 || attendance_pct < 75 ? "Medium Risk" : "Low Risk";

  const riskDescriptions = {
    "Low Risk":    "Your current performance indicates low risk of academic difficulties. Keep up the good work!",
    "Medium Risk": "Your performance shows moderate risk. Focus on attendance and assignments to improve.",
    "High Risk":   "Your performance indicates high academic risk. Immediate attention and faculty support recommended.",
  };

  const gradeOrder = ["F","C","B","B+","A","A+"];
  const gi = gradeOrder.indexOf(grade);

  return {
    predicted_score:    Math.round(score * 10) / 10,
    predicted_grade:    grade,
    grade_confidence:   75,
    predicted_risk:     risk,
    risk_confidence:    80,
    risk_description:   riskDescriptions[risk],
    grade_range:        `${gradeOrder[Math.max(gi-1,0)]} to ${gradeOrder[Math.min(gi+1,5)]}`,
    grade_distribution: { "A+": 5, A: 20, "B+": 35, B: 25, C: 10, F: 5 },
    contributing_factors: [
      { name: "Attendance Pct",             value: 25.6 },
      { name: "Gpa",                        value: 25.2 },
      { name: "Internal Marks",             value: 22.9 },
      { name: "Assignments Completed Pct",  value: 11.5 },
      { name: "Prev Semester Score",        value: 6.0  },
      { name: "Quiz Avg",                   value: 5.7  },
      { name: "Study Hours Per Week",       value: 3.1  },
    ],
    _source: "local",
  };
}

/** POST /api/predict for a single student */
export async function predictStudent(payload) {
  try {
    const res = await fetch(`${API_BASE}/api/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { ...data, _source: "ml_model" };
  } catch {
    console.warn("[EduTrack] ML API unreachable — using local fallback");
    return localPredict(payload);
  }
}

/** GET /api/model/info */
export async function getModelInfo() {
  try {
    const res = await fetch(`${API_BASE}/api/model/info`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    return {
      feature_importance: {
        "attendance_pct": 25.59, "gpa": 25.21, "internal_marks": 22.9,
        "assignments_completed_pct": 11.48, "prev_semester_score": 6.02,
        "quiz_avg": 5.66, "study_hours_per_week": 3.13,
      },
      training_metrics: { score_mae: 2.68, grade_accuracy: 0.748, risk_accuracy: 0.927 },
    };
  }
}

/** POST /api/predict/batch — faculty use */
export async function predictBatch(students) {
  try {
    const res = await fetch(`${API_BASE}/api/predict/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(students),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    return students.map((s, i) => ({ index: i, ...localPredict(s) }));
  }
}
