
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Activity, User, Dumbbell, Home } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const [showLabels, setShowLabels] = useState(true);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-background border-t p-2 md:hidden">
      <NavItem 
        to="/" 
        icon={<Home className="h-6 w-6" />} 
        label="Home" 
        isActive={location.pathname === '/'} 
        showLabel={showLabels} 
      />
      <NavItem 
        to="/activities" 
        icon={<Activity className="h-6 w-6" />} 
        label="Activity" 
        isActive={location.pathname === '/activities'} 
        showLabel={showLabels} 
      />
      <NavItem 
        to="/workouts" 
        icon={<Dumbbell className="h-6 w-6" />} 
        label="Workouts" 
        isActive={location.pathname === '/workouts'} 
        showLabel={showLabels} 
      />
      <NavItem 
        to="/profile" 
        icon={<User className="h-6 w-6" />} 
        label="Profile" 
        isActive={location.pathname === '/profile'} 
        showLabel={showLabels} 
      />
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  showLabel: boolean;
}

const NavItem = ({ to, icon, label, isActive, showLabel }: NavItemProps) => {
  return (
    <Link to={to} className="flex-1">
      <Button 
        variant="ghost" 
        className={cn(
          "w-full flex flex-col items-center justify-center h-auto py-1 px-1",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      >
        {icon}
        {showLabel && <span className="text-xs mt-1">{label}</span>}
      </Button>
    </Link>
  );
};

export default Navigation;
