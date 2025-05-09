
import { ReactNode } from "react";

// Mock data for the dashboard
export const mockData = {
  dailySteps: 7842,
  dailyStepsGoal: 10000,
  caloriesBurned: 427,
  caloriesBurnedGoal: 650,
  activeMinutes: 48,
  activeMinutesGoal: 60,
  heartRate: 72,
  distance: 5.2,
  streakDays: 14,
  completionRate: 86,
  hydration: 1.8,
  hydrationGoal: 2.5,
  sleep: 7.2,
  sleepGoal: 8
};

export const weeklyData = [
  { name: 'Mon', steps: 6500, calories: 380, active: 45, completion: 78 },
  { name: 'Tue', steps: 7200, calories: 420, active: 50, completion: 82 },
  { name: 'Wed', steps: 6800, calories: 400, active: 47, completion: 80 },
  { name: 'Thu', steps: 7842, calories: 427, active: 48, completion: 86 },
  { name: 'Fri', steps: 9200, calories: 510, active: 62, completion: 91 },
  { name: 'Sat', steps: 8300, calories: 470, active: 58, completion: 88 },
  { name: 'Sun', steps: 6700, calories: 390, active: 46, completion: 79 },
];

export const monthlyTrend = [
  { name: 'Week 1', steps: 45000, calories: 2600, active: 320 },
  { name: 'Week 2', steps: 48000, calories: 2750, active: 345 },
  { name: 'Week 3', steps: 52000, calories: 2900, active: 370 },
  { name: 'Week 4', steps: 49000, calories: 2800, active: 350 },
];

interface DataProviderProps {
  children: ReactNode;
}

const DataProvider = ({ children }: DataProviderProps) => {
  return <>{children}</>;
};

export default DataProvider;
