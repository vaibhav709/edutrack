import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, BarChart2, Users, FileText, LogOut, GraduationCap } from 'lucide-react';

const studentLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
  { icon: TrendingUp, label: 'My Progress', path: '/student/progress' },
  { icon: BarChart2, label: 'Performance Prediction', path: '/student/prediction' },
];

const facultyLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/faculty/dashboard' },
  { icon: Users, label: 'Student Management', path: '/faculty/students' },
  { icon: FileText, label: 'Reports & Analytics', path: '/faculty/reports' },
];

export default function Sidebar({ role, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const links = role === 'faculty' ? facultyLinks : studentLinks;

  return (
    <div className="sidebar-gradient w-56 min-h-screen flex flex-col py-6 px-3 fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 mb-8">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <GraduationCap size={18} className="text-white" />
        </div>
        <div>
          <div className="text-white font-bold text-sm leading-tight">EduTrack</div>
          <div className="text-white/60 text-xs">Analytics Platform</div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 flex-1">
        {links.map(({ icon: Icon, label, path }) => (
          <div
            key={path}
            className={`sidebar-link ${location.pathname === path ? 'active' : ''}`}
            onClick={() => navigate(path)}
          >
            <Icon size={16} />
            <span>{label}</span>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div
        className="sidebar-link mt-4 opacity-75 hover:opacity-100"
        onClick={onLogout}
      >
        <LogOut size={16} />
        <span>Logout</span>
      </div>
    </div>
  );
}
