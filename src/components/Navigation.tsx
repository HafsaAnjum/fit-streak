
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, BarChart, Cog, Home, UserCircle, Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

const Navigation = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const closeSheet = () => setOpen(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate('/auth');
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Workouts', path: '/workouts', icon: <Activity className="h-5 w-5" /> },
    { name: 'Activities', path: '/activities', icon: <Activity className="h-5 w-5" /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart className="h-5 w-5" /> },
    { name: 'Fitness', path: '/fitness', icon: <Activity className="h-5 w-5" /> },
    { name: 'Settings', path: '/settings', icon: <Cog className="h-5 w-5" /> },
    { name: 'Profile', path: '/profile', icon: <UserCircle className="h-5 w-5" /> },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const renderNavLinks = () => {
    return navLinks.map((link) => {
      // Skip protected routes if user is not logged in
      if (!user && link.path !== '/') {
        return null;
      }
      
      return (
        <li key={link.name}>
          <Link
            to={link.path}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              isActive(link.path)
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
            onClick={closeSheet}
          >
            {link.icon}
            <span className="ml-3">{link.name}</span>
          </Link>
        </li>
      );
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Mobile menu */}
        {isMobile ? (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="px-2 py-6">
                <Link to="/" className="flex items-center mb-6" onClick={closeSheet}>
                  <span className="text-xl font-bold">FitStreak</span>
                </Link>
                <nav>
                  <ul className="space-y-2">{renderNavLinks()}</ul>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        ) : null}

        {/* Logo */}
        <Link to="/" className="flex items-center mr-4 space-x-2">
          <span className="font-bold text-xl">FitStreak</span>
        </Link>

        {/* Desktop navigation */}
        {!isMobile && (
          <nav className="flex-1 mx-4">
            <ul className="flex space-x-1">
              {renderNavLinks()}
            </ul>
          </nav>
        )}

        {/* Auth buttons */}
        <div className="flex items-center space-x-2">
          {!user ? (
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          ) : (
            <Button variant="ghost" onClick={handleSignOut} className="flex items-center">
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
