
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { useUserSettings } from "@/hooks/useUserSettings";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Link } from "react-router-dom";
import { Moon, Settings, Sun, ChevronRight } from "lucide-react";

const GlobalSettingsDialog = () => {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings, loading } = useUserSettings();
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Quick Settings</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Theme</Label>
            <RadioGroup
              value={theme}
              onValueChange={(value: "light" | "dark" | "system") => setTheme(value)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="flex items-center">
                  <Sun className="w-4 h-4 mr-2" />
                  Light
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className="flex items-center">
                  <Moon className="w-4 h-4 mr-2" />
                  Dark
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system">System</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-1">
            <Label className="text-sm font-medium">Notifications</Label>
            <div className="flex items-center space-x-2">
              <Switch
                id="quick-notifications"
                checked={settings?.notifications_enabled ?? true}
                onCheckedChange={(checked) => 
                  updateSettings({ notifications_enabled: checked })
                }
                disabled={loading}
              />
              <Label htmlFor="quick-notifications">Enable notifications</Label>
            </div>
          </div>

          <div className="pt-2">
            <Button asChild variant="outline" className="w-full justify-between" onClick={() => setOpen(false)}>
              <Link to="/settings">
                All Settings
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSettingsDialog;
