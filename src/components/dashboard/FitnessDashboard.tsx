import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footprints, Heart, Weight, Clock, Activity, BedDouble } from "lucide-react";
import FitnessDataDashboard from "./FitnessDataDashboard";
import { useFitnessData } from "@/hooks/useFitnessData";
import { useFitbitData } from "@/hooks/useFitbitData";
import ActivityTrendsChart from "./ActivityTrendsChart";
import FitnessMetricsSection from "./FitnessMetricsSection";
import ManualFitnessEntry from "../ManualFitnessEntry";
import WebHealthConnect from "../WebHealthConnect";

interface ActivityData {
  date: string;
  steps?: number;
  calories?: number;
  heartRate?: number;
  sleepHours?: number;
  [key: string]: string | number | undefined;
}

const FitnessDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  const { isConnected: isGoogleFitConnected } = useFitnessData();
  const { isConnected: isFitbitConnected, data: fitbitData, loading: fitbitLoading, refresh: refreshFitbit } = useFitbitData();
  
  // Calculate metrics from the Fitbit data
  const fitbitMetrics = useMemo(() => {
    if (!fitbitData) return [];
    
    // Calculate averages
    const averageSteps = fitbitData.steps.length 
      ? Math.round(fitbitData.steps.reduce((sum, day) => sum + day.value, 0) / fitbitData.steps.length) 
      : 0;
    
    const averageCalories = fitbitData.calories.length 
      ? Math.round(fitbitData.calories.reduce((sum, day) => sum + day.value, 0) / fitbitData.calories.length) 
      : 0;
    
    const averageHeartRate = fitbitData.heartRate.length 
      ? Math.round(fitbitData.heartRate.reduce((sum, day) => sum + day.value, 0) / fitbitData.heartRate.length) 
      : 0;
    
    const averageSleepMinutes = fitbitData.sleep.length 
      ? Math.round(fitbitData.sleep.reduce((sum, day) => sum + day.value, 0) / fitbitData.sleep.length) 
      : 0;
    
    return [
      {
        name: "Daily Steps",
        value: averageSteps,
        goal: 10000,
        unit: "steps",
        icon: <Footprints className="h-5 w-5 text-blue-500" />,
        color: "bg-blue-500",
        loading: fitbitLoading
      },
      {
        name: "Calories Burned",
        value: averageCalories,
        goal: 2500,
        unit: "kcal",
        icon: <Activity className="h-5 w-5 text-orange-500" />,
        color: "bg-orange-500",
        loading: fitbitLoading
      },
      {
        name: "Heart Rate",
        value: averageHeartRate,
        goal: null,
        unit: "bpm",
        icon: <Heart className="h-5 w-5 text-red-500" />,
        color: "bg-red-500",
        loading: fitbitLoading
      },
      {
        name: "Sleep Duration",
        value: Math.floor(averageSleepMinutes / 60),
        goal: 8,
        unit: "hours",
        icon: <BedDouble className="h-5 w-5 text-purple-500" />,
        color: "bg-purple-500",
        loading: fitbitLoading
      }
    ];
  }, [fitbitData, fitbitLoading]);

  // Format Fitbit data for charts
  const fitbitChartData = useMemo(() => {
    if (!fitbitData) return [];
    
    // Merge all data points by date
    const mergedData = new Map();
    
    fitbitData.steps.forEach(item => {
      if (!mergedData.has(item.date)) {
        mergedData.set(item.date, { date: item.date });
      }
      mergedData.get(item.date).steps = item.value;
    });
    
    fitbitData.calories.forEach(item => {
      if (!mergedData.has(item.date)) {
        mergedData.set(item.date, { date: item.date });
      }
      mergedData.get(item.date).calories = item.value;
    });
    
    fitbitData.heartRate.forEach(item => {
      if (!mergedData.has(item.date)) {
        mergedData.set(item.date, { date: item.date });
      }
      mergedData.get(item.date).heartRate = item.value;
    });
    
    fitbitData.sleep.forEach(item => {
      if (!mergedData.has(item.date)) {
        mergedData.set(item.date, { date: item.date });
      }
      // Convert minutes to hours for better visualization
      mergedData.get(item.date).sleepHours = Math.round(item.value / 60 * 10) / 10;
    });
    
    // Convert map to array and sort by date
    return Array.from(mergedData.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) as ActivityData[];
  }, [fitbitData]);

  // Check if any data source is connected
  const hasConnectedSource = isGoogleFitConnected || isFitbitConnected;

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
          
          {/* Fitbit Data */}
          {isFitbitConnected && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Fitbit Data</h2>
                <Button size="sm" variant="outline" onClick={refreshFitbit} disabled={fitbitLoading}>
                  {fitbitLoading ? "Syncing..." : "Refresh Data"}
                </Button>
              </div>
              
              <FitnessMetricsSection metrics={fitbitMetrics} loading={fitbitLoading} />
              
              {!fitbitLoading && fitbitChartData.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ActivityTrendsChart 
                    data={fitbitChartData}
                    title="Steps & Calories"
                    loading={fitbitLoading}
                    dataKeys={[
                      { key: "steps", name: "Steps", color: "#8B5CF6" },
                      { key: "calories", name: "Calories", color: "#F97316", unit: "kcal" },
                    ]}
                  />
                  <ActivityTrendsChart 
                    data={fitbitChartData}
                    title="Heart Rate & Sleep"
                    loading={fitbitLoading}
                    dataKeys={[
                      { key: "heartRate", name: "Heart Rate", color: "#EF4444", unit: "bpm" },
                      { key: "sleepHours", name: "Sleep", color: "#8B5CF6", unit: "hrs" }
                    ]}
                  />
                </div>
              )}
            </div>
          )}
          
          {/* No connected sources */}
          {!hasConnectedSource && (
            <Card className="border-dashed border-muted-foreground/50">
              <CardContent className="py-8">
                <div className="text-center">
                  <Activity className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">No Fitness Data Sources Connected</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Connect to Google Fit or Fitbit to see your fitness data, or use manual entry.
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
