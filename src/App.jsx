import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Progress from './pages/Progress';
import Prediction from './pages/Prediction';
import FacultyDashboard from './pages/FacultyDashboard';
import StudentManagement from './pages/StudentManagement';
import Reports from './pages/Reports';

function ProtectedRoute({ user, children, requiredRole }) {
  if (!user) return <Navigate to="/" replace />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'student' ? '/student/dashboard' : '/faculty/dashboard'} replace />;
  }
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const handleLogin = (userData) => setUser(userData);
  const handleLogout = () => setUser(null);
  const props = { user, onLogout: handleLogout };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to={user.role === 'student' ? '/student/dashboard' : '/faculty/dashboard'} /> : <Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
        <Route path="/student/dashboard" element={<ProtectedRoute user={user} requiredRole="student"><Dashboard {...props} /></ProtectedRoute>} />
        <Route path="/student/progress" element={<ProtectedRoute user={user} requiredRole="student"><Progress {...props} /></ProtectedRoute>} />
        <Route path="/student/prediction" element={<ProtectedRoute user={user} requiredRole="student"><Prediction {...props} /></ProtectedRoute>} />
        <Route path="/faculty/dashboard" element={<ProtectedRoute user={user} requiredRole="faculty"><FacultyDashboard {...props} /></ProtectedRoute>} />
        <Route path="/faculty/students" element={<ProtectedRoute user={user} requiredRole="faculty"><StudentManagement {...props} /></ProtectedRoute>} />
        <Route path="/faculty/reports" element={<ProtectedRoute user={user} requiredRole="faculty"><Reports {...props} /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
