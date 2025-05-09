import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  HomeIcon,
  ActivityIcon,
  ClipboardIcon,
  BarChartIcon,
  SettingsIcon,
  UserIcon,
  LogInIcon,
  LogOutIcon,
} from 'lucide-react';
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navigation = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  // Define the navigation items
  const navigationItems = [
    {
      title: 'Home',
      href: '/home',
      icon: <HomeIcon className="h-5 w-5" />,
    },
    {
      title: 'Workout Session', // Changed from "Workouts" to "Workout Session"
      href: '/workout-session', // Changed from "/workouts" to "/workout-session"
      icon: <ActivityIcon className="h-5 w-5" />,
    },
    {
      title: 'Activities',
      href: '/activities',
      icon: <ClipboardIcon className="h-5 w-5" />,
    },
    {
      title: 'Analytics',
      href: '/analytics',
      icon: <BarChartIcon className="h-5 w-5" />,
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: <SettingsIcon className="h-5 w-5" />,
    },
    {
      title: 'Profile',
      href: '/profile',
      icon: <UserIcon className="h-5 w-5" />,
    },
  ];

  return (
    <nav className="bg-background border-b">
      <div className="container max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/home" className="font-bold text-xl">
          Fitness App
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          {navigationItems.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-secondary/50 ${
                location.pathname === item.href ? 'bg-secondary/50 font-medium' : ''
              }`}
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </div>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <UserIcon className="h-4 w-4" />
                <span className="sr-only">Open user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/auth" className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-secondary/50">
            <LogInIcon className="h-5 w-5" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
