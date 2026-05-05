import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, AlertTriangle, Calendar, GraduationCap } from 'lucide-react';
import { facultyData, classPerformance, riskDistribution, attendanceTrend, studentsAtRisk } from '../data/mockData';

export default function FacultyDashboard({ user, onLogout }) {
  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Faculty Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Monitor class performance and identify students who need support</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard title="Total Students" value={facultyData.totalStudents} subtitle="Computer Science Dept." icon={Users} />
        <StatCard title="At-Risk Students" value={facultyData.atRiskStudents} subtitle="Need attention" icon={AlertTriangle} />
        <StatCard title="Average Attendance" value={`${facultyData.averageAttendance}%`} icon={Calendar} change={facultyData.attendanceChange} changePositive={true} />
        <StatCard title="Average GPA" value={facultyData.averageGpa} icon={GraduationCap} change={facultyData.gpaChange} changePositive={true} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Class Performance Distribution */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Class Performance Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={classPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Number of Students" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-3 h-3 rounded-sm bg-indigo-600"></div>
            <span className="text-xs text-gray-500">Number of Students</span>
          </div>
        </div>

        {/* Risk Distribution Pie */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Student Risk Distribution</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" nameKey="name">
                  {riskDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3">
              {riskDistribution.map((r, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: r.color }}></div>
                  <span className="text-xs text-gray-600">{r.name}: {r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Trend */}
      <div className="card p-5 mb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Attendance Trend Over Time</h3>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={attendanceTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            <Line type="monotone" dataKey="attendance" stroke="#7C3AED" strokeWidth={2} dot={{ fill: '#7C3AED', r: 4 }} name="Class Attendance %" />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-1.5 mt-2">
          <div className="w-3 h-0.5 bg-purple-600 rounded"></div>
          <span className="text-xs text-gray-500">Class Attendance %</span>
        </div>
      </div>

      {/* Students Requiring Attention */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={15} className="text-orange-500" />
          <h3 className="text-sm font-semibold text-gray-800">Students Requiring Attention</h3>
        </div>
        <div className="flex flex-col gap-3">
          {studentsAtRisk.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold ${s.risk === 'High Risk' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                  {s.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">{s.name}</div>
                  <div className="text-xs text-gray-400">{s.id} • Semester {s.semester}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-gray-400">GPA</div>
                  <div className="text-sm font-semibold text-gray-700">{s.gpa}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Attendance</div>
                  <div className="text-sm font-semibold text-gray-700">{s.attendance}%</div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${s.risk === 'High Risk' ? 'badge-high' : 'badge-medium'}`}>
                  {s.risk}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
