
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Smartphone, Heart, Share, LogOut } from "lucide-react";

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
  return (
    <Card>
      <CardContent className="p-0 divide-y">
        <SettingsItem 
          icon={<Smartphone className="h-5 w-5 text-primary" />}
          label="Connect Health Data"
          description="Link Apple Health or Google Fit"
        />
        <SettingsItem 
          icon={<Heart className="h-5 w-5 text-red-500" />}
          label="Health Preferences"
          description="Customize your health metrics"
        />
        <SettingsItem 
          icon={<Share className="h-5 w-5 text-blue-500" />}
          label="Share Progress"
          description="Connect social accounts"
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
