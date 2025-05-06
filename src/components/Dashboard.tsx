
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Heart, 
  Flame, 
  Footprints, 
  Timer,
  ArrowUp,
  TrendingUp
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock data for the demo
const mockData = {
  dailySteps: 7842,
  dailyStepsGoal: 10000,
  caloriesBurned: 427,
  caloriesBurnedGoal: 650,
  activeMinutes: 48,
  activeMinutesGoal: 60,
  heartRate: 72,
  distance: 5.2,
};

const weeklyData = [
  { name: 'Mon', steps: 6500, calories: 380, active: 45 },
  { name: 'Tue', steps: 7200, calories: 420, active: 50 },
  { name: 'Wed', steps: 6800, calories: 400, active: 47 },
  { name: 'Thu', steps: 7842, calories: 427, active: 48 },
  { name: 'Fri', steps: 0, calories: 0, active: 0 },
  { name: 'Sat', steps: 0, calories: 0, active: 0 },
  { name: 'Sun', steps: 0, calories: 0, active: 0 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          icon={<Footprints className="h-5 w-5 text-blue-500" />}
          title="Steps"
          value={mockData.dailySteps.toLocaleString()}
          goal={mockData.dailyStepsGoal}
          current={mockData.dailySteps}
          unit=""
          trend={8}
        />
        <MetricCard 
          icon={<Flame className="h-5 w-5 text-orange-500" />}
          title="Calories"
          value={mockData.caloriesBurned}
          goal={mockData.caloriesBurnedGoal}
          current={mockData.caloriesBurned}
          unit="kcal"
          trend={12}
        />
        <MetricCard 
          icon={<Timer className="h-5 w-5 text-green-500" />}
          title="Active Minutes"
          value={mockData.activeMinutes}
          goal={mockData.activeMinutesGoal}
          current={mockData.activeMinutes}
          unit="min"
          trend={-5}
        />
        <MetricCard 
          icon={<Heart className="h-5 w-5 text-red-500" />}
          title="Avg. Heart Rate"
          value={mockData.heartRate}
          goal={null}
          current={null}
          unit="bpm"
          showProgress={false}
          trend={3}
        />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="steps" 
                  stroke="#8B5CF6" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="#0ED3CF" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="active" 
                  stroke="#10B981" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  goal: number | null;
  current: number | null;
  unit: string;
  showProgress?: boolean;
  trend: number;
}

const MetricCard = ({ 
  icon, 
  title, 
  value, 
  goal, 
  current, 
  unit, 
  showProgress = true,
  trend 
}: MetricCardProps) => {
  const progress = goal && current ? (current / goal) * 100 : null;
  const trendColor = trend >= 0 ? "text-green-500" : "text-red-500";
  const trendIcon = trend >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowUp className="h-3 w-3 transform rotate-180" />;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-2">
          <div className="p-2 rounded-md bg-secondary">{icon}</div>
          <div className={`flex items-center ${trendColor} text-xs font-medium`}>
            {trendIcon}
            <span className="ml-1">{Math.abs(trend)}%</span>
          </div>
        </div>
        <div className="text-2xl font-bold mt-2">
          {value}
          <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
        </div>
        <p className="text-xs text-muted-foreground">{title}</p>
        {showProgress && progress !== null && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Dashboard;
