
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings, Edit, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const ProfileHeader: React.FC = () => {
  const { profile } = useAuth();
  
  return (
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <Button variant="outline" size="icon">
        <Settings className="h-4 w-4" />
      </Button>
    </header>
  );
};

export default ProfileHeader;
