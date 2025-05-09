
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Smartphone, Heart, Share, LogOut, Moon, Sun, Bell } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { GoogleFitService } from "@/services/GoogleFitService";
import { toast } from "sonner";

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  showArrow?: boolean;
  onClick?: () => void;
}

const SettingsItem = ({ icon, label, description, showArrow = true, onClick }: SettingsItemProps) => {
  return (
    <div 
      className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="mr-4">
          {icon}
        </div>
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {showArrow && (
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      )}
    </div>
  );
};

const SettingsSection: React.FC<{onLogout?: () => void}> = ({ onLogout }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    toast.success(`${newTheme === "dark" ? "Dark" : "Light"} mode activated`);
  };

  const connectGoogleFit = async () => {
    try {
      const isConnected = await GoogleFitService.isConnected();
      
      if (isConnected) {
        navigate("/fitness");
      } else {
        GoogleFitService.initiateAuth();
      }
    } catch (error) {
      console.error("Error with Google Fit connection:", error);
      toast.error("Failed to connect to Google Fit");
    }
  };

  return (
    <Card>
      <CardContent className="p-0 divide-y">
        <SettingsItem 
          icon={<Smartphone className="h-5 w-5 text-primary" />}
          label="Connect Health Data"
          description="Link Apple Health or Google Fit"
          onClick={connectGoogleFit}
        />
        <SettingsItem 
          icon={resolvedTheme === "dark" ? 
            <Moon className="h-5 w-5 text-blue-500" /> : 
            <Sun className="h-5 w-5 text-yellow-500" />
          }
          label={`Switch to ${resolvedTheme === "dark" ? "Light" : "Dark"} Mode`}
          description="Change app appearance"
          onClick={toggleTheme}
        />
        <SettingsItem 
          icon={<Bell className="h-5 w-5 text-green-500" />}
          label="Notification Settings"
          description="Manage your notifications"
          onClick={() => navigate("/settings")}
        />
        <SettingsItem 
          icon={<Heart className="h-5 w-5 text-red-500" />}
          label="Health Preferences"
          description="Customize your health metrics"
          onClick={() => navigate("/settings")}
        />
        <SettingsItem 
          icon={<Share className="h-5 w-5 text-blue-500" />}
          label="Share Progress"
          description="Connect social accounts"
          onClick={() => navigate("/settings")}
        />
        <SettingsItem 
          icon={<LogOut className="h-5 w-5 text-muted-foreground" />}
          label="Log Out"
          description="Sign out of your account"
          showArrow={false}
          onClick={onLogout}
        />
      </CardContent>
    </Card>
  );
};

export default SettingsSection;
export { SettingsItem };
