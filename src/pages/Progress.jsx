import Layout from '../components/Layout';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { subjects, radarData } from '../data/mockData';

function AttBadge({ val }) {
  const color = val >= 85 ? 'text-green-600 bg-green-50' : val >= 75 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50';
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{val}%</span>;
}

export default function Progress({ user, onLogout }) {
  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Academic Progress</h1>
        <p className="text-sm text-gray-500 mt-0.5">Detailed breakdown of your performance across all subjects</p>
      </div>

      {/* Subject-wise Table */}
      <div className="card mb-5">
        <div className="p-5 pb-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-purple-600 rounded-sm"></div>
            </div>
            <h3 className="text-sm font-semibold text-gray-800">Subject-wise Performance</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Code</th>
                <th>Internal</th>
                <th>Exam</th>
                <th>Total</th>
                <th>Percentage</th>
                <th>Attendance</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s.code}>
                  <td className="font-semibold text-gray-800">{s.name}</td>
                  <td className="text-gray-500">{s.code}</td>
                  <td>{s.internal}</td>
                  <td>{s.exam}</td>
                  <td className="font-semibold">{s.total}</td>
                  <td><span className="text-green-600 font-semibold text-xs bg-green-50 px-2 py-0.5 rounded-full">{s.percentage}.0%</span></td>
                  <td><AttBadge val={s.attendance} /></td>
                  <td>{s.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        {/* Score Distribution */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Score Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={subjects.map(s => ({ name: s.code, score: s.total }))}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 150]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="score" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance vs Attendance Radar */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Performance vs Attendance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={subjects.map(s => ({ subject: s.code, score: s.attendance }))}>
              <PolarGrid stroke="#f0f0f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#9ca3af' }} />
              <Radar dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  );
}
