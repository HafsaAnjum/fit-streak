
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footprints, Heart, Activity } from "lucide-react";
import FitnessDataDashboard from "./FitnessDataDashboard";
import { useFitnessData } from "@/hooks/useFitnessData";
import ActivityTrendsChart from "./ActivityTrendsChart";
import FitnessMetricsSection from "./FitnessMetricsSection";
import ManualFitnessEntry from "../ManualFitnessEntry";
import WebHealthConnect from "../WebHealthConnect";

interface ActivityData {
  date: string;
  steps?: number;
  calories?: number;
  distance?: number;
  activeMinutes?: number;
  [key: string]: string | number | undefined;
}

const FitnessDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  const { isConnected: isGoogleFitConnected } = useFitnessData();
  
  // Check if any data source is connected
  const hasConnectedSource = isGoogleFitConnected;

  return (
    <div className="space-y-6 animate-fade-in">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="connect">Connect Sources</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Google Fit Data */}
          {isGoogleFitConnected && <FitnessDataDashboard />}
          
          {/* No connected sources */}
          {!hasConnectedSource && (
            <Card className="border-dashed border-muted-foreground/50">
              <CardContent className="py-8">
                <div className="text-center">
                  <Activity className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No Fitness Data Sources Connected</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Connect to Google Fit to see your fitness data, or use manual entry.
                  </p>
                  <Button 
                    onClick={() => setActiveTab("connect")} 
                    variant="outline" 
                    className="mt-4"
                  >
                    Connect Data Source
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="connect">
          <div className="space-y-6">
            <WebHealthConnect />
          </div>
        </TabsContent>
        
        <TabsContent value="manual">
          <ManualFitnessEntry />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FitnessDashboard;
