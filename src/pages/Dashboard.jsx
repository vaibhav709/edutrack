import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Calendar, GraduationCap, CheckSquare, TrendingUp, Clock, Bell } from 'lucide-react';
import { studentData, performanceTrend, weeklyStudy, deadlines, notifications } from '../data/mockData';

export default function Dashboard({ user, onLogout }) {
  return (
    <Layout user={user} onLogout={onLogout}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="text-sm text-gray-500 mt-0.5">Here's your academic progress overview for Semester {studentData.semester}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Attendance"
          value={`${studentData.attendance}%`}
          icon={Calendar}
          change={studentData.attendanceChange}
          changePositive={true}
        />
        <StatCard
          title="Current GPA"
          value={studentData.gpa}
          icon={GraduationCap}
          change={studentData.gpaChange}
          changePositive={true}
        />
        <StatCard
          title="Assignments Completed"
          value={`${studentData.assignmentsCompleted}/${studentData.assignmentsTotal}`}
          subtitle={`${studentData.assignmentsTotal - studentData.assignmentsCompleted} pending`}
          icon={CheckSquare}
        />
        <StatCard
          title="Predicted Grade"
          value={studentData.predictedGrade}
          subtitle="Based on current performance"
          icon={TrendingUp}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Performance Trend */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={performanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="score" stroke="#7C3AED" strokeWidth={2} dot={{ fill: '#7C3AED', r: 4 }} name="Your Score" />
              <Line type="monotone" dataKey="avg" stroke="#93c5fd" strokeWidth={2} dot={{ fill: '#93c5fd', r: 3 }} name="Class Average" strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-3 h-0.5 bg-purple-600 rounded"></div>Your Score</div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500"><div className="w-3 h-0.5 bg-blue-300 rounded"></div>Class Average</div>
          </div>
        </div>

        {/* Weekly Study */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Weekly Study Progress</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyStudy}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="hours" fill="#7C3AED" radius={[4, 4, 0, 0]} name="Study Hours" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-3 h-3 rounded-sm bg-purple-600"></div>
            <span className="text-xs text-gray-500">Study Hours</span>
          </div>
        </div>
      </div>

      {/* Deadlines & Notifications */}
      <div className="grid grid-cols-2 gap-4">
        {/* Upcoming Deadlines */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={15} className="text-orange-500" />
            <h3 className="text-sm font-semibold text-gray-800">Upcoming Deadlines</h3>
          </div>
          <div className="flex flex-col gap-3">
            {deadlines.map((d, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">{d.title}</div>
                    <div className="text-xs text-gray-400">{d.course}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-xs font-semibold text-gray-700">{d.date}</div>
                  <div className="text-xs text-gray-400">{d.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={15} className="text-orange-500" />
            <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
          </div>
          <div className="flex flex-col gap-3">
            {notifications.map((n, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${n.type === 'warning' ? 'bg-yellow-400' : n.type === 'danger' ? 'bg-red-400' : 'bg-blue-400'}`}></div>
                <div>
                  <div className="text-sm text-gray-800">{n.message}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
