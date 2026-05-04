import Layout from '../components/Layout';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { predictionData } from '../data/mockData';
import { TrendingUp, AlertTriangle, Brain } from 'lucide-react';

const COLORS = ['#7C3AED', '#3B82F6', '#10b981', '#f59e0b'];

function GradeBadge({ grade }) {
  const colors = { A: 'grade-a', 'A+': 'grade-a', 'B+': 'grade-b', B: 'grade-b', C: 'grade-c' };
  return (
    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold ${colors[grade] || 'grade-b'}`}>
      {grade}
    </span>
  );
}

export default function Prediction({ user, onLogout }) {
  const d = predictionData;

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Performance Prediction</h1>
        <p className="text-sm text-gray-500 mt-0.5">AI-powered analysis and grade predictions based on your current progress</p>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {/* Predicted Final Score */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={14} className="text-purple-600" />
            <span className="text-xs text-gray-500 font-medium">Predicted Final Score</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{d.predictedFinalScore}%</div>
          <div className="text-xs text-gray-400 mt-1">Based on current performance reports</div>
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Confidence Level</span>
              <span>{d.confidenceLevel}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full">
              <div className="h-1.5 btn-gradient rounded-full" style={{ width: `${d.confidenceLevel}%` }}></div>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={14} className="text-green-500" />
            <span className="text-xs text-gray-500 font-medium">Risk Assessment</span>
          </div>
          <div className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full mb-2">
            {d.riskLevel}
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">{d.riskDescription}</p>
          <div className="mt-3 flex gap-3">
            <div><div className="text-xs text-gray-400">Student Standing</div><div className="text-xs font-semibold text-green-600">{d.studentStanding}</div></div>
            <div><div className="text-xs text-gray-400">Improvement Tips</div><div className="text-xs font-semibold text-orange-500">{d.improvementTips}</div></div>
          </div>
        </div>

        {/* AI Prediction Model */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Brain size={14} className="text-blue-500" />
            <span className="text-xs text-gray-500 font-medium">AI Prediction Model</span>
          </div>
          <div className="text-5xl font-bold text-gray-900 mb-1">{d.aiPredictedGrade}</div>
          <div className="text-xs text-gray-400">Expected Final Grade</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-xs text-gray-400">Grade Range</div>
              <div className="text-sm font-semibold text-gray-700">{d.gradeRange}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <div className="text-xs text-gray-400">Frequency</div>
              <div className="text-sm font-semibold text-gray-700">{d.frequency}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* Prediction vs Actual */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Prediction vs Actual Performance</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={d.predictionVsActual}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="predicted" stroke="#7C3AED" strokeWidth={2} dot={{ r: 3 }} name="Predicted Score" strokeDasharray="5 3" />
              <Line type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} name="Actual Score" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-4 border-b-2 border-dashed border-purple-600"></div>Predicted</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-4 border-b-2 border-blue-500"></div>Actual</div>
          </div>
        </div>

        {/* Contributing Factors */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Performance Contributing Factors</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={d.contributingFactors} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" nameKey="name">
                {d.contributingFactors.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subject-wise Predictions Table */}
      <div className="card">
        <div className="p-5 pb-2">
          <h3 className="text-sm font-semibold text-gray-800">Subject-wise Grade Predictions</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Current Score</th>
              <th>Predicted Score</th>
              <th>Expected Grade</th>
              <th>Improvement</th>
            </tr>
          </thead>
          <tbody>
            {d.subjectPredictions.map((s, i) => (
              <tr key={i}>
                <td className="font-medium text-gray-800">{s.subject}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 bg-gray-100 rounded-full">
                      <div className="h-1.5 bg-blue-400 rounded-full" style={{ width: s.current }}></div>
                    </div>
                    <span className="text-xs text-gray-600">{s.current}</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 bg-gray-100 rounded-full">
                      <div className="h-1.5 bg-purple-500 rounded-full" style={{ width: s.predicted }}></div>
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
