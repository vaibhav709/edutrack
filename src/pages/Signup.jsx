import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, GraduationCap, User, BookOpen, Building } from 'lucide-react';

export default function Signup({ onLogin }) {
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ name: '', email: '', department: '', password: '', confirm: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = { name: form.name || (role === 'student' ? 'Vaibhav Shelke' : 'Dr. Syed Ismail'), role };
    onLogin(user);
    navigate(role === 'student' ? '/student/dashboard' : '/faculty/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="sidebar-gradient w-[42%] flex flex-col justify-between p-10 relative overflow-hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <GraduationCap size={18} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">EduTrack</div>
            <div className="text-white/60 text-xs">Analytics Platform</div>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Join Thousands<br />of Students &<br />Faculty
          </h1>
          <p className="text-white/70 text-sm mb-8">
            Start tracking academic performance and unlock AI-powered insights today
          </p>
          <div className="bg-white/10 rounded-xl p-4 flex items-center gap-3">
            <div className="flex -space-x-2">
              {['#7C3AED','#3B82F6','#10B981'].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center text-white text-xs font-bold" style={{ background: c }}>
                  {['A','B','C'][i]}
                </div>
              ))}
            </div>
            <div>
              <div className="text-white font-bold text-sm">10,000+ Users</div>
              <div className="text-white/60 text-xs">Across 90+ Institutions</div>
            </div>
          </div>
        </div>

        <div className="text-white/40 text-xs">© 2026 EduTrack. All rights reserved.</div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-10 overflow-y-auto">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
          <p className="text-gray-500 text-sm mb-8">Get started with EduTrack today</p>

          {/* Role selector */}
          <div className="mb-5">
            <label className="text-sm font-medium text-gray-600 mb-2 block">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'student', label: 'Student', icon: User },
                { value: 'faculty', label: 'Faculty', icon: BookOpen },
              ].map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className={`flex flex-col items-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${
                    role === value
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">Full Name</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-purple-400">
                <User size={15} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">Email Address</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-purple-400">
                <Mail size={15} className="text-gray-400 flex-shrink-0" />
                <input
                  type="email"
                  placeholder="you@university.edu"
                  className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">Department / Course</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-purple-400">
                <Building size={15} className="text-gray-400 flex-shrink-0" />
                <select
                  className="flex-1 text-sm bg-transparent outline-none text-gray-700"
                  value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}
                >
                  <option value="">Select Department</option>
                  <option>Computer Science</option>
                  <option>Electrical Engineering</option>
                  <option>Mechanical Engineering</option>
                  <option>Civil Engineering</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">Password</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-purple-400">
                <Lock size={15} className="text-gray-400 flex-shrink-0" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">Confirm Password</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-purple-400">
                <Lock size={15} className="text-gray-400 flex-shrink-0" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
                  value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" required />
              <span className="text-sm text-gray-600">
                I agree to the{' '}
                <span className="text-purple-600 font-medium cursor-pointer">Terms of Service</span>
                {' '}and{' '}
                <span className="text-purple-600 font-medium cursor-pointer">Privacy Policy</span>
              </span>
            </label>

            <button
              type="submit"
              className="btn-gradient text-white py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <a href="/" className="text-purple-600 font-semibold hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
