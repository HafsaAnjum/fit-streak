
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, ArrowRight, CheckCircle2, Info } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GoogleFitService } from "@/services/GoogleFitService";
import { toast } from "sonner";

interface FitnessSourceConnectorProps {
  onConnect: (source: string, connected: boolean) => void;
}

const FitnessSourceConnector: React.FC<FitnessSourceConnectorProps> = ({ onConnect }) => {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<string | null>(null);
  
  const handleConnect = async (source: string) => {
    setConnecting(source);
    
    try {
      if (source === 'Google Fit') {
        // Store the current URL to return after authentication
        localStorage.setItem("authRedirectUrl", "/onboarding");
        
        // Initiate Google Fit OAuth flow
        GoogleFitService.initiateAuth();
        return; // We'll return from the callback component
      }
      
      // For other providers or as fallback, simulate a connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      setConnected(source);
      onConnect(source, true);
    } catch (error) {
      console.error(`Error connecting to ${source}:`, error);
      toast.error(`Failed to connect to ${source}`, {
        description: "Please try again later"
      });
    } finally {
      setConnecting(null);
    }
  };
  
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold">Connect Your Fitness Data</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Connect to a fitness service to automatically sync your activity data
      </p>
      
      <div className="space-y-3">
        <Card className={`p-4 border ${connected === 'Google Fit' ? 'border-green-500' : 'border-border'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                <Activity className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-medium">Google Fit</h3>
                <p className="text-xs text-muted-foreground">Steps, activities, heart rate & more</p>
              </div>
            </div>
            
            {connected === 'Google Fit' ? (
              <div className="flex items-center text-green-500">
                <CheckCircle2 className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Connected</span>
              </div>
            ) : (
              <Button 
                size="sm" 
                onClick={() => handleConnect('Google Fit')}
                disabled={!!connecting}
              >
                {connecting === 'Google Fit' ? 'Connecting...' : 'Connect'}
              </Button>
            )}
          </div>
        </Card>
        
        <div className="flex flex-col space-y-3 mt-6">
          <div className="flex justify-between items-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center text-xs">
                  <Info className="h-3 w-3 mr-1" />
                  How data sharing works
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>About Fitness Data Integration</DialogTitle>
                  <DialogDescription>
                    We use secure OAuth connections to access your fitness data
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm mb-3">
                    When you connect a fitness service, we request the following permissions:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-2">
                    <li>Read access to your daily activity summaries</li>
                    <li>Step count and distance data</li>
                    <li>Heart rate measurements (when available)</li>
                    <li>Calories burned estimates</li>
                    <li>Sleep data (optional)</li>
                  </ul>
                  <p className="text-sm mt-3 text-muted-foreground">
                    Your data is private and secure. You can disconnect these services at any time from your profile settings.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground"
              onClick={() => onConnect('', false)}
            >
              Skip for now
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FitnessSourceConnector;
