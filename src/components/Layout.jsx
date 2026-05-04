import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ children, user, onLogout }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={user?.role} onLogout={onLogout} />
      <div className="flex-1 ml-56 flex flex-col min-h-screen">
        <Navbar user={user} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
