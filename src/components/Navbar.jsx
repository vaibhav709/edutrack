import { Bell, Search, ChevronDown } from 'lucide-react';

export default function Navbar({ user }) {
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U';

  return (
    <div className="h-14 bg-white border-b border-gray-100 flex items-center px-6 gap-4 sticky top-0 z-20">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search students, courses, or reports..."
            className="bg-transparent text-sm text-gray-600 placeholder-gray-400 flex-1 border-none outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Bell */}
        <button className="relative w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
          <Bell size={16} className="text-gray-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-purple-600 rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-semibold text-gray-800">{user?.name}</div>
            <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
          </div>
          <div className="w-8 h-8 btn-gradient rounded-full flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}
