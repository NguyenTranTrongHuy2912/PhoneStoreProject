import React from 'react';

/**
 * StatsCard — KPI metric card with icon, value, label and optional trend
 * Props: icon, label, value, trend (number, % change), color
 */
function StatsCard({ icon: Icon, label, value, trend, color = 'blue', loading = false }) {
  const colorMap = {
    blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   ring: 'bg-blue-100' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', ring: 'bg-emerald-100' },
    amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600',  ring: 'bg-amber-100' },
    violet: { bg: 'bg-violet-50', icon: 'text-violet-600', ring: 'bg-violet-100' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-4 hover:shadow-md transition-shadow duration-200">
      <div className={`${c.ring} rounded-xl p-3 flex-shrink-0`}>
        {Icon && <Icon className={`text-xl ${c.icon}`} />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide truncate">{label}</p>
        {loading ? (
          <div className="h-7 w-24 bg-gray-100 rounded-lg animate-pulse mt-1" />
        ) : (
          <p className="text-2xl font-bold text-gray-900 mt-0.5 truncate">{value}</p>
        )}
        {trend !== undefined && !loading && (
          <p className={`text-xs mt-1 font-medium ${trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}% so với tháng trước
          </p>
        )}
      </div>
    </div>
  );
}

export default StatsCard;
