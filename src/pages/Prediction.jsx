import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, PieChart, Pie, Cell, Legend, BarChart, Bar,
} from 'recharts';
import { studentData, subjects, weeklyStudy } from '../data/mockData';
import { predictStudent, buildPayload, buildSubjectPayload, getModelInfo } from '../services/mlService';
import { TrendingUp, AlertTriangle, Brain, Cpu, RefreshCw, CheckCircle } from 'lucide-react';

const COLORS = ['#7C3AED', '#3B82F6', '#10b981', '#f59e0b', '#ef4444', '#6b7280'];

function GradeBadge({ grade }) {
  const colors = { A: 'grade-a', 'A+': 'grade-a', 'B+': 'grade-b', B: 'grade-b', C: 'grade-c', F: 'bg-red-100 text-red-700' };
  return (
    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-md text-sm font-bold ${colors[grade] || 'grade-b'}`}>
      {grade}
    </span>
  );
}

function ConfidenceBar({ value, color = '#7C3AED' }) {
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
        <div className="h-1.5 rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs text-gray-500 w-8">{value}%</span>
    </div>
  );
}

export default function Prediction({ user, onLogout }) {
  const [result, setResult]       = useState(null);
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [subjectPreds, setSubjectPreds] = useState([]);
  const [apiSource, setApiSource] = useState('');

  const runPrediction = async () => {
    setLoading(true);
    const payload = buildPayload(studentData, subjects, weeklyStudy);
    const res = await predictStudent(payload);
    setResult(res);
    setApiSource(res._source === 'ml_model' ? '🟢 Live ML Model' : '🟡 Local Fallback');

    // Per-subject predictions
    const perSubject = await Promise.all(
      subjects.map(async (sub) => {
        const sp = buildSubjectPayload(sub, studentData, weeklyStudy);
        const r  = await predictStudent(sp);
        const currentPct = Math.round((sub.total / 150) * 100);
        return {
          subject:     sub.name,
          current:     `${currentPct}%`,
          predicted:   `${Math.round(r.predicted_score)}%`,
          grade:       r.predicted_grade,
          improvement: `+${Math.max(0, Math.round(r.predicted_score - currentPct))}%`,
          raw:         r,
        };
      })
    );
    setSubjectPreds(perSubject);
    setLoading(false);
  };

  useEffect(() => {
    runPrediction();
    getModelInfo().then(setModelInfo);
  }, []);

  if (loading) {
    return (
      <Layout user={user} onLogout={onLogout}>
        <div className="flex flex-col items-center justify-center h-80 gap-4">
          <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Running ML prediction model…</p>
        </div>
      </Layout>
    );
  }

  const d = result;
  const factorChartData = d.contributing_factors?.map(f => ({
    name: f.name.split(' ').slice(0, 2).join(' '),
    value: f.value,
  })) || [];

  // Build grade distribution as array for pie
  const gradeDist = Object.entries(d.grade_distribution || {}).map(([name, value], i) => ({
    name, value, color: COLORS[i % COLORS.length],
  }));

  // Trend: show projected improvement over coming months
  const trendData = [
    { month: 'Aug', predicted: 68, actual: 72 },
    { month: 'Sep', predicted: 73, actual: 75 },
    { month: 'Oct', predicted: 77, actual: 78 },
    { month: 'Nov', predicted: 80, actual: 80 },
    { month: 'Dec', predicted: 83, actual: 82 },
    { month: 'Jan', predicted: 86, actual: 85 },
    { month: 'Feb', predicted: Math.round(d.predicted_score), actual: null },
  ];

  return (
    <Layout user={user} onLogout={onLogout}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Performance Prediction</h1>
          <p className="text-sm text-gray-500 mt-0.5">AI-powered analysis and grade predictions based on your current progress</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
            {apiSource}
          </span>
          <button
            onClick={runPrediction}
            className="flex items-center gap-2 text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>
      </div>

      {/* Top 3 Cards */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {/* Predicted Score */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-purple-600" />
            <span className="text-xs text-gray-500 font-medium">Predicted Final Score</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{d.predicted_score}%</div>
          <div className="text-xs text-gray-400 mt-1">Based on current performance metrics</div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Model Confidence</span>
              <span>{d.grade_confidence}%</span>
            </div>
            <ConfidenceBar value={d.grade_confidence} color="#7C3AED" />
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className={
              d.predicted_risk === 'High Risk' ? 'text-red-500' :
              d.predicted_risk === 'Medium Risk' ? 'text-yellow-500' : 'text-green-500'
            } />
            <span className="text-xs text-gray-500 font-medium">Risk Assessment</span>
          </div>
          <span className={`inline-block text-sm font-semibold px-3 py-1 rounded-full mb-2 ${
            d.predicted_risk === 'High Risk'   ? 'bg-red-100 text-red-700' :
            d.predicted_risk === 'Medium Risk' ? 'bg-yellow-100 text-yellow-700' :
                                                  'bg-green-100 text-green-700'
          }`}>
            {d.predicted_risk}
          </span>
          <p className="text-xs text-gray-500 leading-relaxed">{d.risk_description}</p>
          <div className="mt-2">
            <div className="text-xs text-gray-400 mb-1">Risk Confidence</div>
            <ConfidenceBar value={d.risk_confidence}
              color={d.predicted_risk === 'High Risk' ? '#ef4444' : d.predicted_risk === 'Medium Risk' ? '#f59e0b' : '#10b981'} />
          </div>
        </div>

        {/* AI Grade */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={14} className="text-blue-500" />
            <span className="text-xs text-gray-500 font-medium">AI Prediction Model</span>
          </div>
          <div className="text-5xl font-bold text-gray-900 mb-1">{d.predicted_grade}</div>
          <div className="text-xs text-gray-400">Expected Final Grade</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-xs text-gray-400">Grade Range</div>
              <div className="text-sm font-semibold text-gray-700">{d.grade_range}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-xs text-gray-400">Score</div>
              <div className="text-sm font-semibold text-gray-700">{d.predicted_score}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* Prediction vs Actual trend */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Prediction vs Actual Performance</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[55, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="predicted" stroke="#7C3AED" strokeWidth={2} dot={{ r: 3 }} name="Predicted Score" strokeDasharray="5 3" />
              <Line type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} name="Actual Score" connectNulls={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-4 border-b-2 border-dashed border-purple-600" />Predicted
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-4 border-b-2 border-blue-500" />Actual
            </div>
          </div>
        </div>

        {/* Feature Importance / Contributing Factors */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Performance Contributing Factors</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={factorChartData} layout="vertical">
              <XAxis type="number" domain={[0, 30]} tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} width={100} />
              <Tooltip
                contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                formatter={(v) => [`${v}%`, 'Importance']}
              />
              <Bar dataKey="value" fill="#7C3AED" radius={[0, 4, 4, 0]} name="Importance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grade Distribution + Model Info */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* Grade probability distribution */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Grade Probability Distribution</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={170}>
              <PieChart>
                <Pie data={gradeDist} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                  {gradeDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, 'Probability']} contentStyle={{ fontSize: 11, borderRadius: 8, border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5">
              {gradeDist.map((g, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: g.color }} />
                  <span className="text-xs text-gray-600 font-medium w-5">{g.name}</span>
                  <span className="text-xs text-gray-400">{g.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Model metadata */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Cpu size={14} className="text-purple-600" />
            <h3 className="text-sm font-semibold text-gray-800">Model Information</h3>
          </div>
          <div className="flex flex-col gap-2.5">
            {[
              { label: 'Algorithm', value: 'Random Forest (Ensemble)' },
              { label: 'Training Samples', value: '2,000 student records' },
              { label: 'Score MAE', value: `${modelInfo?.training_metrics?.score_mae ?? 2.68} points` },
              { label: 'Grade Accuracy', value: `${((modelInfo?.training_metrics?.grade_accuracy ?? 0.748) * 100).toFixed(1)}%` },
              { label: 'Risk Accuracy', value: `${((modelInfo?.training_metrics?.risk_accuracy ?? 0.927) * 100).toFixed(1)}%` },
              { label: 'Features Used', value: '7 academic indicators' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
                <span className="text-xs text-gray-500">{label}</span>
                <span className="text-xs font-semibold text-gray-700">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-1.5 bg-green-50 rounded-lg px-3 py-2">
            <CheckCircle size={12} className="text-green-600 flex-shrink-0" />
            <span className="text-xs text-green-700 font-medium">Model validated on holdout test set</span>
          </div>
        </div>
      </div>

      {/* Per-subject predictions table */}
      <div className="card">
        <div className="p-5 pb-2">
          <h3 className="text-sm font-semibold text-gray-800">Subject-wise Grade Predictions</h3>
          <p className="text-xs text-gray-400 mt-0.5">ML model predictions per subject based on individual performance metrics</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Current Score</th>
              <th>ML Predicted Score</th>
              <th>Expected Grade</th>
              <th>Improvement</th>
            </tr>
          </thead>
          <tbody>
            {subjectPreds.map((s, i) => (
              <tr key={i}>
                <td className="font-medium text-gray-800">{s.subject}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 bg-gray-100 rounded-full">
                      <div className="h-1.5 bg-blue-400 rounded-full" style={{ width: s.current }} />
                    </div>
                    <span className="text-xs text-gray-600">{s.current}</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 bg-gray-100 rounded-full">
                      <div className="h-1.5 bg-purple-500 rounded-full" style={{ width: s.predicted }} />
                    </div>
                    <span className="text-xs text-gray-600">{s.predicted}</span>
                  </div>
                </td>
                <td><GradeBadge grade={s.grade} /></td>
                <td><span className="text-green-600 font-semibold text-xs">{s.improvement}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
