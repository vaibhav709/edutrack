import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, GraduationCap, User, BookOpen, CheckCircle } from 'lucide-react';

export default function Login({ onLogin }) {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = {
      name: role === 'student' ? 'Vaibhav Shelke' : 'Dr. Syed Ismail',
      role,
    };
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
            Track Progress,<br />Predict Success
          </h1>
          <p className="text-white/70 text-sm mb-8">
            Comprehensive student progress tracking and AI-powered performance prediction system
          </p>
          <div className="flex flex-col gap-4">
            {[
              { icon: CheckCircle, title: 'Real-time Analytics', desc: 'Monitor academic performance with live data' },
              { icon: CheckCircle, title: 'AI Predictions', desc: 'Get accurate grade predictions and insights' },
              { icon: CheckCircle, title: 'Risk Detection', desc: 'Early identification of at-risk students' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <Icon size={16} className="text-white/80 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white text-sm font-semibold">{title}</div>
                  <div className="text-white/60 text-xs">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-white/40 text-xs">© 2026 EduTrack. All rights reserved.</div>

        {/* Decorative circles */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full"></div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-10">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h2>
          <p className="text-gray-500 text-sm mb-8">Sign in to access your dashboard</p>

          {/* Role selector */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-600 mb-2 block">Select Role</label>
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
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">Email Address</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-50">
                <Mail size={15} className="text-gray-400 flex-shrink-0" />
                <input
                  type="email"
                  placeholder="you@university.edu"
                  className="flex-1 text-sm bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">Password</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-50">
                <Lock size={15} className="text-gray-400 flex-shrink-0" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="flex-1 text-sm bg-transparent border-none outline-none text-gray-700 placeholder-gray-400"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-purple-600 font-medium hover:underline">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="btn-gradient text-white py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity mt-1"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <a href="/signup" className="text-purple-600 font-semibold hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
