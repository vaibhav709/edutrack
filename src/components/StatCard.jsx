import { TrendingUp } from 'lucide-react';

export default function StatCard({ title, value, subtitle, icon: Icon, change, changeLabel, changePositive = true }) {
  return (
    <div className="card p-5 flex-1 min-w-0">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-500 mb-1 font-medium">{title}</div>
          <div className="text-2xl font-bold text-gray-900 leading-tight">{value}</div>
          {subtitle && <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>}
          {change !== undefined && (
            <div className={`text-xs mt-1 font-medium ${changePositive ? 'text-green-500' : 'text-red-400'}`}>
              {changePositive ? '↑' : '↓'} {Math.abs(change)}% {changeLabel || 'from last month'}
            </div>
          )}
        </div>
        {Icon && (
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-purple-50 text-purple-600 ml-2 flex-shrink-0">
            <Icon size={18} />
          </div>
        )}
      </div>
    </div>
  );
}
