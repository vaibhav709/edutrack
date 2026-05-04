import Layout from '../components/Layout';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { reportsData } from '../data/mockData';
import { Users, TrendingUp, GraduationCap, AlertTriangle, Download, FileText, RefreshCw } from 'lucide-react';

function MetricCard({ icon: Icon, value, label, bg, text }) {
  return (
    <div className={`rounded-xl p-5 flex flex-col gap-1 ${bg}`}>
      <div className="flex items-center justify-between">
        <Icon size={18} className={text} />
      </div>
      <div className={`text-2xl font-bold mt-1 ${text}`}>{value}</div>
      <div className={`text-xs font-medium ${text} opacity-80`}>{label}</div>
    </div>
  );
}

export default function Reports({ user, onLogout }) {
  const d = reportsData;

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reports &amp; Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Comprehensive analysis and downloadable reports</p>
        </div>
        <button className="flex items-center gap-2 btn-gradient text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <RefreshCw size={14} />
          Generate New Report
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <MetricCard icon={Users} value={d.totalStudents} label="Total Students" bg="bg-indigo-600" text="text-white" />
        <MetricCard icon={TrendingUp} value={`${d.passRate}%`} label="Pass Rate" bg="bg-green-500" text="text-white" />
        <MetricCard icon={GraduationCap} value={d.averageGpa} label="Average GPA" bg="bg-purple-600" text="text-white" />
        <MetricCard icon={AlertTriangle} value={d.atRiskCount} label="At Risk Students" bg="bg-orange-500" text="text-white" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Subject Performance */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Subject Performance Analysis</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={d.subjectPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="subject" type="category" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="avg" fill="#4F46E5" radius={[0, 4, 4, 0]} name="Average" />
              <Bar dataKey="highest" fill="#10b981" radius={[0, 4, 4, 0]} name="Highest" />
              <Bar dataKey="lowest" fill="#f43f5e" radius={[0, 4, 4, 0]} name="Lowest" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 flex-wrap">
            {[['#4F46E5', 'Average'], ['#10b981', 'Highest'], ['#f43f5e', 'Lowest']].map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ background: c }}></div><span className="text-xs text-gray-500">{l}</span></div>
            ))}
          </div>
        </div>

        {/* Monthly Progress */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Monthly Progress Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={d.monthlyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="passRate" stroke="#7C3AED" strokeWidth={2} dot={{ r: 3 }} name="Pass Rate %" />
              <Line type="monotone" dataKey="avgScore" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} name="Average Score" strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-3 h-0.5 bg-purple-600 rounded"></div>Pass Rate %</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-3 h-0.5 bg-blue-400 rounded"></div>Average Score</div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Skill Assessment Radar */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Class Skill Assessment</h3>
          <div className="text-xs text-gray-400 mb-3">Average Score</div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={d.skillAssessment}>
              <PolarGrid stroke="#f0f0f0" />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#9ca3af' }} />
              <Radar dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Grade Distribution */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Grade Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={d.gradeDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="grade" type="category" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={24} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none' }} />
              <Bar dataKey="count" fill="#7C3AED" radius={[0, 4, 4, 0]} name="Number of Students" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-3 h-3 rounded-sm bg-purple-600"></div>
            <span className="text-xs text-gray-500">Number of Students</span>
          </div>
        </div>
      </div>

      {/* Generated Reports */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={15} className="text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-800">Generated Reports</h3>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { title: 'Semester Performance Report', desc: 'Complete analysis of student performance for current semester', date: '8/8/2026' },
            { title: 'At-Risk Students Analysis', desc: 'Detailed report on students requiring academic support', date: '8/1/2026' },
          ].map((r, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <FileText size={16} className="text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{r.title}</div>
                  <div className="text-xs text-gray-400">{r.desc}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <div className="text-xs text-gray-400">Released: {r.date}</div>
                <button className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors">
                  <Download size={12} />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
