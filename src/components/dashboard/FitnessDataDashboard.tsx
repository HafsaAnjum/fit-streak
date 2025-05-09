
import React, { useMemo } from "react";
import { Footprints, Flame, Activity, Award, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFitnessData } from "@/hooks/useFitnessData";
import FitnessMetricsSection from "./FitnessMetricsSection";
import ActivityTrendsChart from "./ActivityTrendsChart";
import ActivityAchievements from "./ActivityAchievements";

const FitnessDataDashboard = () => {
  const { data, loading, isConnected, refresh } = useFitnessData({ days: 7 });
  
  // Calculate metrics from the data
  const metrics = useMemo(() => {
    if (!data) return [];
    
    // Calculate totals and averages
    const totalSteps = data.steps.reduce((sum, day) => sum + day.value, 0);
    const totalCalories = data.calories.reduce((sum, day) => sum + day.value, 0);
    const totalActiveMinutes = data.activeMinutes.reduce((sum, day) => sum + day.value, 0);
    const totalDistance = data.distance.reduce((sum, day) => sum + day.value, 0);
    
    // Calculate trends (percentage change)
    // Compare last day with average of previous days
    const calculateTrend = (arr: { date: string; value: number }[]): number => {
      if (arr.length <= 1) return 0;
      const lastValue = arr[arr.length - 1].value;
      const prevAverage = arr.slice(0, -1).reduce((sum, item) => sum + item.value, 0) / (arr.length - 1);
      return prevAverage === 0 ? 0 : Math.round(((lastValue - prevAverage) / prevAverage) * 100);
    };
    
    const stepsTrend = calculateTrend(data.steps);
    const caloriesTrend = calculateTrend(data.calories);
    const activeMinutesTrend = calculateTrend(data.activeMinutes);
    
    return [
      {
        name: "Daily Steps",
        value: Math.round(totalSteps / 7),
        goal: 10000,
        unit: "steps",
        icon: <Footprints className="h-5 w-5 text-blue-500" />,
        color: "bg-blue-500",
        trend: stepsTrend,
        loading: false
      },
      {
        name: "Calories Burned",
        value: Math.round(totalCalories / 7),
        goal: 2500,
        unit: "kcal",
        icon: <Flame className="h-5 w-5 text-orange-500" />,
        color: "bg-orange-500",
        trend: caloriesTrend,
        loading: false
      },
      {
        name: "Active Minutes",
        value: Math.round(totalActiveMinutes / 7),
        goal: 60,
        unit: "min",
        icon: <Activity className="h-5 w-5 text-green-500" />,
        color: "bg-green-500",
        trend: activeMinutesTrend,
        loading: false
      },
      {
        name: "Total Distance",
        value: Math.round(totalDistance * 10) / 10,
        unit: "km",
        icon: <Heart className="h-5 w-5 text-purple-500" />,
        color: "bg-purple-500",
        loading: false
      }
    ];
  }, [data]);
  
  // Format data for the chart
  const chartData = useMemo(() => {
    if (!data) return [];
    
    // Merge all data points by date
    const mergedData = new Map();
    
    data.steps.forEach(item => {
      if (!mergedData.has(item.date)) {
        mergedData.set(item.date, { date: item.date });
      }
      mergedData.get(item.date).steps = item.value;
    });
    
    data.calories.forEach(item => {
      if (!mergedData.has(item.date)) {
        mergedData.set(item.date, { date: item.date });
      }
      mergedData.get(item.date).calories = item.value;
    });
    
    data.activeMinutes.forEach(item => {
      if (!mergedData.has(item.date)) {
        mergedData.set(item.date, { date: item.date });
      }
      mergedData.get(item.date).activeMinutes = item.value;
    });
    
    data.distance.forEach(item => {
      if (!mergedData.has(item.date)) {
        mergedData.set(item.date, { date: item.date });
      }
      // Convert to km
      mergedData.get(item.date).distance = Math.round(item.value * 10) / 10;
    });
    
    // Convert map to array and sort by date
    return Array.from(mergedData.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  // Generate sample achievements
  const achievements = useMemo(() => {
    if (!data) return [];
    
    const totalSteps = data.steps.reduce((sum, day) => sum + day.value, 0);
    const totalDistance = data.distance.reduce((sum, day) => sum + day.value, 0);
    const maxStepsDay = data.steps.reduce((max, day) => day.value > max.value ? day : max, { date: '', value: 0 });
    
    const result = [];
    
    // Add achievements based on actual data
    if (totalSteps >= 70000) {
      result.push({
        title: "70K Steps Club",
        description: "Reached 70,000 steps in a week",
        date: new Date().toLocaleDateString(),
        icon: <Trophy className="h-5 w-5 text-amber-500" />,
        color: "bg-amber-100",
        highlight: true
      });
    }
    
    if (totalDistance >= 50) {
      result.push({
        title: "50km Milestone",
        description: "Covered more than 50km in a week",
        date: new Date().toLocaleDateString(),
        icon: <Award className="h-5 w-5 text-blue-500" />,
        color: "bg-blue-100"
      });
    }
    
    if (maxStepsDay.value > 15000) {
      const date = new Date(maxStepsDay.date).toLocaleDateString();
      result.push({
        title: "Step Champion",
        description: `Achieved ${maxStepsDay.value.toLocaleString()} steps in a single day`,
        date,
        icon: <Star className="h-5 w-5 text-purple-500" />,
        color: "bg-purple-100"
      });
    }
    
    // Add some default achievements if needed
    if (result.length < 3) {
      result.push({
        title: "Getting Started",
        description: "Connected your fitness data",
        date: new Date().toLocaleDateString(),
        icon: <Award className="h-5 w-5 text-green-500" />,
        color: "bg-green-100"
      });
    }
    
    return result;
  }, [data]);
  
  // Calculate current streak
  const streak = useMemo(() => {
    if (!data || !data.steps.length) return 0;
    
    let currentStreak = 0;
    const today = new Date().setHours(0, 0, 0, 0);
    const sortedDays = [...data.steps].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    for (let i = 0; i < sortedDays.length; i++) {
      const dayData = sortedDays[i];
      const dayDate = new Date(dayData.date).setHours(0, 0, 0, 0);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      const expectedDay = expectedDate.setHours(0, 0, 0, 0);
      
      if (dayDate === expectedDay && dayData.value >= 5000) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    return currentStreak;
  }, [data]);
  
  if (!isConnected) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Fitness Metrics */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Fitness Tracking</h2>
          <Button size="sm" variant="outline" onClick={refresh} disabled={loading}>
            {loading ? "Syncing..." : "Sync Data"}
          </Button>
        </div>
        <FitnessMetricsSection metrics={metrics} loading={loading} />
      </div>
      
      {/* Activity Charts */}
      <div className="grid grid-cols-1 gap-6">
        <ActivityTrendsChart 
          data={chartData}
          title="Weekly Activity"
          loading={loading}
          dataKeys={[
            { key: "steps", name: "Steps", color: "#8B5CF6" },
            { key: "calories", name: "Calories", color: "#F97316", unit: "kcal" },
            { key: "activeMinutes", name: "Active Minutes", color: "#10B981", unit: "min" }
          ]}
        />
      </div>
      
      {/* Achievements Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2">
          <ActivityTrendsChart 
            data={chartData}
            title="Distance Tracking"
            loading={loading}
            dataKeys={[
              { key: "distance", name: "Distance", color: "#3B82F6", unit: "km" }
            ]}
          />
        </div>
        <ActivityAchievements 
          streak={streak}
          achievements={achievements}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default FitnessDataDashboard;
