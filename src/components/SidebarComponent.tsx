import React from 'react';
import {
  LayoutDashboard,
  AlertTriangle,
  Users,
  Bell,
  BarChart2,
  Settings,
} from 'lucide-react';

export type NavigationTab =
  | 'dashboard'
  | 'incidents'
  | 'teams'
  | 'alerts'
  | 'analytics'
  | 'settings';

interface SidebarComponentProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  unreadAlertsCount: number;
  activeIncidentsCount: number;
}

export const SidebarComponent: React.FC<SidebarComponentProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onCloseMobile,
  unreadAlertsCount,
  activeIncidentsCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavigationTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'incidents' as NavigationTab,
      label: 'Incidents',
      icon: AlertTriangle,
      badge: activeIncidentsCount > 0 ? activeIncidentsCount : null,
      badgeColor: 'bg-red-500/20 text-red-400',
    },
    {
      id: 'teams' as NavigationTab,
      label: 'Response Teams',
      icon: Users,
      badge: '26',
      badgeColor: 'bg-blue-500/20 text-blue-400',
    },
    {
      id: 'alerts' as NavigationTab,
      label: 'Alerts',
      icon: Bell,
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : null,
      badgeColor: 'bg-amber-500/20 text-amber-400',
    },
    {
      id: 'analytics' as NavigationTab,
      label: 'Analytics',
      icon: BarChart2,
      badge: null,
    },
    {
      id: 'settings' as NavigationTab,
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* Clean Modern Sidebar */}
      <aside
        className={`fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-[#0f172a] border-r border-slate-800 z-40 transition-transform duration-200 flex flex-col justify-between w-60 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive ? 'bg-blue-800 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};
