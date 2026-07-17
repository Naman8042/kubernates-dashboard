import { useState } from 'react';
import { 
  LayoutDashboard, 
  Network, 
  Send, 
  Box, 
  FileText, 
  BarChart3, 
  Bell, 
  Settings,
  X,
  Calendar
} from 'lucide-react';
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, url: '/dashboard' },
    { name: 'Clusters', icon: Network, url: '/clusters' },
    { name: 'Deployments', icon: Send, url: '/deployments' },
    { name: 'Pods', icon: Box, url: '/pods' },
    { name: 'Logs', icon: FileText, url: '/logs' },
    { name: 'Metrics', icon: BarChart3, url: '/metrics' },
    { name: 'Alerts', icon: Bell, url: '/alerts' },
    { name: 'Events', icon: Calendar, url: '/events' },
  ];

  // Determine active item based on current path
  const getActiveItem = () => {
    const currentPath = location.pathname;
    const active = menuItems.find(item => currentPath.startsWith(item.url));
    return active ? active.name : 'Dashboard';
  };

  const [activeItem, setActiveItem] = useState(getActiveItem);

  function navigateHandler(url: string) {
    navigate(url);
    setActiveItem(menuItems.find(item => item.url === url)?.name || 'Dashboard');
    // Close mobile menu on navigation
    setIsMobileMenuOpen(false);
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-screen w-64 transform bg-white border-r border-gray-200 
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex h-full flex-col px-3 py-4 overflow-y-auto">
          {/* Logo / Header with close button for mobile */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center ps-2.5">
              <div className="p-1.5 bg-blue-600 rounded-lg mr-3 shadow-sm shrink-0">
                <Box className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">
                Kubernetes
              </span>
            </div>
            
            {/* Close button - mobile only */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <ul className="space-y-1 font-medium flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;

              return (
                <li key={item.name}>
                  <button
                    onClick={() => navigateHandler(item.url)}
                    className={`flex items-center w-full p-2.5 rounded-lg transition-all duration-200 group hover:cursor-pointer ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                        : 'text-slate-500 hover:bg-gray-100 hover:text-blue-600'
                    }`}
                  >
                    <Icon className={`w-5 h-5 transition-colors shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                    }`} />
                    <span className="ms-3 text-sm truncate">{item.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Bottom Settings Link */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <button
              onClick={() => {
                navigate('/settings');
                setActiveItem('Settings');
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center w-full p-2.5 rounded-lg transition-all group ${
                activeItem === 'Settings' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-500 hover:bg-gray-100 hover:text-blue-600'
              }`}
            >
              <Settings className={`w-5 h-5 shrink-0 ${
                activeItem === 'Settings' ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
              }`} />
              <span className="ms-3 text-sm">Settings</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};