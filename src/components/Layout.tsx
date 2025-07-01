import React from 'react';
import { useApp } from '../contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Calendar, 
  Users, 
  FileText, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state, dispatch } = useApp();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('dental-center-user');
    toast.success('Logged out successfully');
  };

  const adminNavItems = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Patients', href: '/patients', icon: Users },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
    { name: 'Records', href: '/records', icon: FileText },
  ];

  const patientNavItems = [
    { name: 'My Dashboard', href: '/', icon: BarChart3 },
    { name: 'My Appointments', href: '/my-appointments', icon: Calendar },
    { name: 'My Records', href: '/my-records', icon: FileText },
  ];

  const navItems = state.currentUser?.role === 'Admin' ? adminNavItems : patientNavItems;

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 lg:hidden bg-background/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-card border-r border-border shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <h1 className="text-xl font-bold text-foreground">
            Dental Center
          </h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3 flex-1">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`sidebar-nav-item ${
                    isActiveRoute(item.href) ? 'active' : ''
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar>
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {state.currentUser?.role}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {state.currentUser?.email}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content area with left margin to account for fixed sidebar */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="bg-card shadow-sm border-b border-border h-16 flex items-center px-6 lg:px-8 sticky top-0 z-10">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden mr-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex-1" />
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-foreground">
              Welcome, {state.currentUser?.role}
            </span>
          </div>
        </header>

        {/* Scrollable main content */}
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;