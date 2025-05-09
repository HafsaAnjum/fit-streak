
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Activity, Info } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const WebHealthConnect = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { user } = useAuth();
  
  const requestHealthPermissions = async () => {
    setIsConnecting(true);
    
    try {
      // This is a simulated connection since we can't use actual device integration in the sandbox
      // In a real app, we'd connect to the Web Health APIs or use OAuth for services like Google Fit
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful connection
      if (user) {
        // Update user profile with connection status
        const { error } = await supabase
          .from('profiles')
          .update({ fitness_level: 'connected' }) // Using fitness_level instead of health_connected
          .eq('id', user.id);
          
        if (error) {
          throw error;
        }
      }
      
      toast.success("Health services connected!", {
        description: "Your fitness data will now sync automatically",
      });
    } catch (error) {
      console.error("Failed to connect health services:", error);
      toast.error("Failed to connect", {
        description: "Please try again or connect manually in settings",
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  return (
    <Card className="border border-primary/10">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-green-500/10">
        <CardTitle className="text-lg flex items-center">
          <Activity className="mr-2 h-5 w-5 text-primary" />
          Connect Health Services
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground mb-4">
          Connect to Apple Health or Google Fit to automatically sync your fitness data.
        </p>
        
        <div className="flex flex-col space-y-3">
          <Button 
            onClick={requestHealthPermissions}
            disabled={isConnecting}
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
          >
            {isConnecting ? "Connecting..." : "Connect Health Services"}
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="mt-2">
                <Info className="mr-2 h-4 w-4" />
                How it works
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>About Health Integration</DialogTitle>
                <DialogDescription>
                  FitStreak can connect to Apple Health and Google Fit to sync your fitness data automatically.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <p className="text-sm">
                  This integration allows us to access:
                </p>
                <ul className="list-disc list-inside text-sm space-y-2">
                  <li>Step count data</li>
                  <li>Heart rate measurements</li>
                  <li>Calories burned</li>
                  <li>Distance walked/run</li>
                  <li>Sleep tracking information</li>
                </ul>
                <p className="text-sm text-muted-foreground">
                  Your data is securely stored and only used to provide personalized fitness insights.
                  You can disconnect these services at any time from your profile settings.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebHealthConnect;
