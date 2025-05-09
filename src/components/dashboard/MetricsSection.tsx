
import React from "react";
import EnhancedMetricCard from "./EnhancedMetricCard";
import { Footprints, Flame, Activity, Award } from "lucide-react";
import { motion } from "framer-motion";

interface MetricsSectionProps {
  mockData: {
    dailySteps: number;
    dailyStepsGoal: number;
    caloriesBurned: number;
    caloriesBurnedGoal: number;
    activeMinutes: number;
    activeMinutesGoal: number;
    streakDays: number;
    [key: string]: any;
  };
}

const MetricsSection = ({ mockData }: MetricsSectionProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <EnhancedMetricCard 
        icon={<Footprints className="h-5 w-5 text-blue-500" />}
        title="Daily Steps"
        value={mockData.dailySteps.toLocaleString()}
        goal={mockData.dailyStepsGoal}
        current={mockData.dailySteps}
        unit=""
        trend={8}
        color="bg-blue-500"
      />
      <EnhancedMetricCard 
        icon={<Flame className="h-5 w-5 text-orange-500" />}
        title="Calories Burned"
        value={mockData.caloriesBurned}
        goal={mockData.caloriesBurnedGoal}
        current={mockData.caloriesBurned}
        unit="kcal"
        trend={12}
        color="bg-orange-500"
      />
      <EnhancedMetricCard 
        icon={<Activity className="h-5 w-5 text-green-500" />}
        title="Active Minutes"
        value={mockData.activeMinutes}
        goal={mockData.activeMinutesGoal}
        current={mockData.activeMinutes}
        unit="min"
        trend={-5}
        color="bg-green-500"
      />
      <EnhancedMetricCard 
        icon={<Award className="h-5 w-5 text-purple-500" />}
        title="Streak Days"
        value={mockData.streakDays}
        goal={null}
        current={null}
        unit="days"
        showProgress={false}
        trend={3}
        color="bg-purple-500"
      />
    </motion.div>
  );
};

export default MetricsSection;
