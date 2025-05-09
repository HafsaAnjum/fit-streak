
import React, { useState, useEffect } from "react";
import { BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrendingUp, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Import refactored components
import MetricsSection from "./dashboard/MetricsSection";
import WeeklyActivityChart from "./dashboard/WeeklyActivityChart";
import MonthlyTrendChart from "./dashboard/MonthlyTrendChart";
import CompletionRateChart from "./dashboard/CompletionRateChart";
import UpcomingWorkouts from "./dashboard/UpcomingWorkouts";
import DailyGoalsCard from "./dashboard/DailyGoalsCard";
import { mockData, weeklyData, monthlyTrend } from "./dashboard/DataProvider";
import FitnessDataDashboard from "./dashboard/FitnessDataDashboard";
import { useFitnessData } from "@/hooks/useFitnessData";
import { useFitnessUpdates } from "@/hooks/useFitnessUpdates";

// Import new components
import WorkoutPlanner from "./workouts/WorkoutPlanner";
import AchievementTracker from "./achievements/AchievementTracker";

const Dashboard = () => {
  const { isConnected } = useFitnessData();
  const { lastUpdate, refresh } = useFitnessUpdates();
  
  return (
    <div className="space-y-6 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center">
          <BarChart className="mr-2 h-6 w-6 text-primary" />
          Dashboard Overview
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={refresh}>
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Sync Data</span>
          </Button>
          <Button variant="default" size="sm" className="flex items-center gap-1" asChild>
            <Link to="/fitness">
              <Activity className="h-3.5 w-3.5" />
              <span>Fitness Dashboard</span>
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Fitness Data Dashboard (only shows if connected) */}
      {isConnected && <FitnessDataDashboard />}

      {/* New Features */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <WorkoutPlanner />
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AchievementTracker />
      </motion.div>

      {/* Original Dashboard Content */}
      <MetricsSection mockData={mockData} />

      {/* Charts Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <WeeklyActivityChart data={weeklyData} />
        <MonthlyTrendChart data={monthlyTrend} />
      </motion.div>

      {/* Completion Rate Chart */}
      <CompletionRateChart data={weeklyData} />

      {/* Workouts and Goals */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <UpcomingWorkouts />
        <DailyGoalsCard mockData={mockData} />
      </motion.div>
    </div>
  );
};

export default Dashboard;
