
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Settings as SettingsIcon, LogOut, User, Bell, Shield, Palette, Moon, Sun } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function Settings() {
  const { signOut, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      setOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast.success(`${!darkMode ? "Dark" : "Light"} mode activated`);
    // In a real app, you would implement actual dark mode toggling here
  };
  
  const toggleNotifications = () => {
    setNotifications(!notifications);
    toast.success(`Notifications ${!notifications ? "enabled" : "disabled"}`);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <SettingsIcon className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Account</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Manage</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {darkMode ? (
                        <Moon className="h-4 w-4 text-primary" />
                      ) : (
                        <Sun className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Dark Mode</p>
                      <p className="text-xs text-muted-foreground">
                        Switch between light & dark
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={darkMode} 
                    onCheckedChange={toggleDarkMode} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bell className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Notifications</p>
                      <p className="text-xs text-muted-foreground">
                        Receive app notifications
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={notifications} 
                    onCheckedChange={toggleNotifications} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Privacy</p>
                      <p className="text-xs text-muted-foreground">
                        Manage your data and privacy
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Palette className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Theme</p>
                      <p className="text-xs text-muted-foreground">
                        Change app appearance
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Change</Button>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t">
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
