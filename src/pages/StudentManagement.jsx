import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Search, Filter, Eye, Edit, UserPlus, ChevronUp, ChevronDown, Cpu } from 'lucide-react';
import { allStudents, weeklyStudy } from '../data/mockData';
import { predictBatch } from '../services/mlService';

function RiskBadge({ risk }) {
  const cls = risk === 'High Risk' ? 'badge-high' : risk === 'Medium Risk' ? 'badge-medium' : 'badge-low';
  return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>{risk}</span>;
}

function GradeBadge({ grade }) {
  const colors = { 'A+': 'grade-a', A: 'grade-a', 'B+': 'grade-b', B: 'grade-b', C: 'grade-c' };
  return (
    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold ${colors[grade] || 'grade-b'}`}>
      {grade}
    </span>
  );
}

export default function StudentManagement({ user, onLogout }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All Students');
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [mlPredictions, setMlPredictions] = useState({});
  const [mlLoading, setMlLoading] = useState(true);

  useEffect(() => {
    // Build batch payload for all students
    const payloads = allStudents.map(s => ({
      student_id:                  s.id,
      attendance_pct:              s.attendance,
      gpa:                         s.gpa,
      internal_marks:              s.gpa * 4.5,      // proxy
      assignments_completed_pct:   s.attendance * 0.9,
      study_hours_per_week:        s.gpa * 0.55,
      quiz_avg:                    s.gpa * 9,
      prev_semester_score:         s.gpa * 8.5,
    }));
    predictBatch(payloads).then(results => {
      const map = {};
      results.forEach(r => { map[r.student_id] = r; });
      setMlPredictions(map);
      setMlLoading(false);
    });
  }, []);

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  let data = allStudents.filter(s => {
    const q = search.toLowerCase();
    const match = s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    const riskMatch = filter === 'All Students' || (mlPredictions[s.id]?.predicted_risk || s.risk) === filter;
    return match && riskMatch;
  });

  if (sortField) {
    data = [...data].sort((a, b) => {
      let av = a[sortField], bv = b[sortField];
      if (typeof av === 'string') av = av.toLowerCase(), bv = bv.toLowerCase();
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
  }

  const SortIcon = ({ field }) => (
    <span className="ml-1 inline-flex flex-col gap-0" onClick={() => handleSort(field)} style={{ cursor: 'pointer' }}>
      <ChevronUp size={10} className={sortField === field && sortDir === 'asc' ? 'text-purple-600' : 'text-gray-300'} />
      <ChevronDown size={10} className={sortField === field && sortDir === 'desc' ? 'text-purple-600' : 'text-gray-300'} />
    </span>
  );

  return (
    <Layout user={user} onLogout={onLogout}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Student Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">View and manage student performance data</p>
        </div>
        <button className="flex items-center gap-2 btn-gradient text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <UserPlus size={15} />
          Add Student
        </button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between p-4 border-b border-gray-50">
          <div className="flex items-center gap-2 text-xs text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full">
            <Cpu size={11} />
            {mlLoading ? 'Running ML predictions…' : 'ML predictions loaded'}
          </div>
          <div className="flex items-center gap-2 flex-1 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
            <Search size={14} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or student ID..."
              className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <select
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-600 bg-white outline-none"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option>All Students</option>
              <option>Low Risk</option>
              <option>Medium Risk</option>
              <option>High Risk</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Student <SortIcon field="name" /></th>
                <th>Student ID <SortIcon field="id" /></th>
                <th>Department</th>
                <th>Semester</th>
                <th>GPA <SortIcon field="gpa" /></th>
                <th>Attendance <SortIcon field="attendance" /></th>
                <th>Risk Level</th>
                <th>Predicted Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full btn-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">{s.name}</div>
                        <div className="text-xs text-gray-400">{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-gray-500 font-mono text-xs">{s.id}</td>
                  <td className="text-gray-600">{s.department}</td>
                  <td className="text-gray-600">{s.semester}</td>
                  <td className="font-semibold text-gray-800">{s.gpa}</td>
                  <td>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.attendance >= 85 ? 'text-green-600 bg-green-50' : s.attendance >= 75 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50'}`}>
                      {s.attendance}%
                    </span>
                  </td>
                  <td>
                    <RiskBadge risk={mlPredictions[s.id]?.predicted_risk || s.risk} />
                    {mlPredictions[s.id] && (
                      <div className="text-xs text-gray-400 mt-0.5">ML: {mlPredictions[s.id].risk_confidence}% conf.</div>
                    )}
                  </td>
                  <td>
                    <GradeBadge grade={mlPredictions[s.id]?.predicted_grade || s.predictedGrade} />
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-purple-50 flex items-center justify-center text-gray-400 hover:text-purple-600 transition-colors">
                        <Eye size={14} />
                      </button>
                      <button className="w-7 h-7 rounded-lg bg-gray-50 hover:bg-blue-50 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-10">No students found.</div>
          )}
        </div>
      </div>
    </Layout>
  );
}
