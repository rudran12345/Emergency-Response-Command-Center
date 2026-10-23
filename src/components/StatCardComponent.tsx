import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardComponentProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  variant: 'critical' | 'warning' | 'info' | 'success';
  trend?: string;
  isPulsing?: boolean;
}

export const StatCardComponent: React.FC<StatCardComponentProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant,
  trend,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'critical':
        return {
          iconBg: 'bg-red-500/10 text-red-400',
          badge: 'bg-red-500/10 text-red-400 border border-red-500/20',
        };
      case 'warning':
        return {
          iconBg: 'bg-amber-500/10 text-amber-400',
          badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
        };
      case 'success':
        return {
          iconBg: 'bg-emerald-500/10 text-emerald-400',
          badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
        };
      case 'info':
      default:
        return {
          iconBg: 'bg-blue-500/10 text-blue-400',
          badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
        };
    }
  };

  const colors = getColors();

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-4 sm:p-5 hover:border-slate-700 transition">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-lg ${colors.iconBg} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {value}
        </span>
        {trend && (
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
            {trend}
          </span>
        )}
      </div>

      <p className="text-xs text-slate-400">{subtitle}</p>
    </div>
  );
};
