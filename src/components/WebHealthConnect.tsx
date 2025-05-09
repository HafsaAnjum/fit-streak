
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Activity, Info, CheckCircle, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { GoogleFitService } from "@/services/GoogleFitService";

const WebHealthConnect = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    // Check if Google Fit is already connected
    const checkConnection = async () => {
      if (user) {
        const connected = await GoogleFitService.isConnected();
        setIsConnected(connected);
      }
    };
    
    checkConnection();
  }, [user]);
  
  const connectToGoogleFit = async () => {
    setIsConnecting(true);
    
    try {
      // Redirect to Google OAuth flow
      GoogleFitService.initiateAuth();
    } catch (error) {
      console.error("Failed to connect to Google Fit:", error);
      toast.error("Failed to initiate connection", {
        description: "Please try again or connect manually in settings",
      });
      setIsConnecting(false);
    }
  };
  
  const disconnectGoogleFit = async () => {
    setIsConnecting(true);
    
    try {
      const success = await GoogleFitService.disconnect();
      
      if (success) {
        setIsConnected(false);
        toast.success("Successfully disconnected from Google Fit");
      } else {
        throw new Error("Failed to disconnect");
      }
    } catch (error) {
      console.error("Failed to disconnect from Google Fit:", error);
      toast.error("Failed to disconnect", {
        description: "Please try again later",
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
          Fitness Data Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-muted-foreground mb-4">
          Connect to Google Fit to automatically sync your activity data and view detailed fitness analytics.
        </p>
        
        <div className="flex flex-col space-y-3">
          <Card className={`p-4 border ${isConnected ? 'border-green-500' : 'border-border'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#4285F4" strokeWidth="2" />
                    <path d="M8 12L12 16L16 12" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 8V16" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Google Fit</h3>
                  <p className="text-xs text-muted-foreground">Steps, activities, distance & more</p>
                </div>
              </div>
              
              {isConnected ? (
                <div className="flex items-center">
                  <div className="flex items-center text-green-500 mr-4">
                    <CheckCircle className="h-5 w-5 mr-1" />
                    <span className="text-sm font-medium">Connected</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={disconnectGoogleFit}
                    disabled={isConnecting}
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  onClick={connectToGoogleFit}
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Connecting...' : 'Connect'}
                </Button>
              )}
            </div>
          </Card>
          
          <div className="flex flex-col space-y-3 mt-4">
            <div className="flex justify-between items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center text-xs">
                    <Info className="mr-2 h-3 w-3" />
                    How data sharing works
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>About Fitness Data Integration</DialogTitle>
                    <DialogDescription>
                      We use OAuth to securely access your fitness data
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <p className="text-sm">
                      When you connect Google Fit, we request access to:
                    </p>
                    <ul className="list-disc list-inside text-sm space-y-2">
                      <li>Daily activity summaries</li>
                      <li>Step count and distance data</li>
                      <li>Calories burned</li>
                      <li>Activity duration</li>
                      <li>Heart rate (when available)</li>
                    </ul>
                    <p className="text-sm text-muted-foreground">
                      Your data is securely stored and only used to provide personalized fitness insights.
                      You can disconnect these services at any time.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WebHealthConnect;
