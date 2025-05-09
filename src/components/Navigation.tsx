
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, BarChart2, Settings, Award, User, Activity, UserCircle, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/context/AuthContext";

const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  
  if (location.pathname === "/auth" || location.pathname.startsWith("/auth/") || 
      location.pathname === "/onboarding" || location.pathname.startsWith("/onboarding/")) {
    return null;
  }
  
  const navigationItems = [
    { path: "/home", label: "Home", icon: <Home className="h-5 w-5" /> },
    { path: "/workouts", label: "Workouts", icon: <Dumbbell className="h-5 w-5" /> },
    { path: "/activities", label: "Activities", icon: <Calendar className="h-5 w-5" /> },
    { path: "/analytics", label: "Analytics", icon: <BarChart2 className="h-5 w-5" /> },
    { path: "/community", label: "Community", icon: <Award className="h-5 w-5" /> },
  ];
  
  const isActive = (path: string) => {
    if (path === "/home" && location.pathname === "/") return true;
    if (path === "/workouts" && (location.pathname === "/workouts" || location.pathname.startsWith("/workout/"))) return true;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  // Mobile Navigation Bar
  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-20">
        <div className="flex justify-around items-center h-16">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center h-full w-full transition-colors",
                isActive(item.path)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              {item.icon}
              <span className="text-[10px] mt-1">{item.label}</span>
            </Link>
          ))}
          <Link
            to="/settings"
            className={cn(
              "flex flex-col items-center justify-center h-full w-full transition-colors",
              isActive("/settings")
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <Settings className="h-5 w-5" />
            <span className="text-[10px] mt-1">Settings</span>
          </Link>
        </div>
      </nav>
    );
  }
  
  // Desktop Navigation Bar
  return (
    <header className="sticky top-0 z-20 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-7xl items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-2 flex items-center">
            <Activity className="h-6 w-6 text-primary" />
            <span className="ml-2 text-xl font-bold">FitTrack</span>
          </Link>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive(item.path)
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center">
            <Link
              to="/settings"
              className={cn(
                "px-2 py-2 text-sm font-medium transition-colors hover:text-primary mr-2",
                isActive("/settings")
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Settings className="h-5 w-5" />
            </Link>
            
            <Link
              to="/profile"
              className="ml-2 flex items-center"
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCircle className="h-6 w-6 text-primary" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
