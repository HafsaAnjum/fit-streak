
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings, Edit, User, ChevronLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ProfileHeader: React.FC = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  
  const handleEditProfile = () => {
    toast({
      title: "Edit Profile",
      description: "Profile editing will be available soon!",
    });
  };
  
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex justify-between items-center mb-6"
    >
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Profile
          </h1>
          <p className="text-xs text-muted-foreground">
            {profile?.username || "Update your personal details"}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleEditProfile}
          className="flex items-center gap-1 hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <Edit className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Edit</span>
        </Button>
        <Button variant="outline" size="icon" className="hover:bg-primary/10 hover:text-primary transition-colors">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </motion.header>
  );
};

export default ProfileHeader;
